// server.cjs  (Node 18+ / CommonJS)
// Kurulum: npm i express googleapis dotenv node-cache

const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const NodeCache = require("node-cache");
const { google } = require("googleapis");

// .env mutlaka server.cjs ile aynı klasörde olsun
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ---- Port & Redirect ----
const rawPort = process.env.PORT || "5187";
const PORT = parseInt(rawPort, 10) || 5187;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

// ---- App & Cache ----
const app = express();
const cache = new NodeCache({ stdTTL: 900 });        // 15 dk cache (reviews & places)
const debugCache = new NodeCache({ stdTTL: 86400 }); // 24 saat cache (account list)
const SCOPES = ["https://www.googleapis.com/auth/business.manage"];

// Başlangıç env kontrolleri (ne eksik hemen görelim)
console.log("ENV CHECK → PLACES_API_KEY exists?", !!process.env.PLACES_API_KEY);
console.log("ENV CHECK → PLACE_ID exists?", !!process.env.PLACE_ID);
console.log("ENV CHECK → GP_CLIENT_ID exists?", !!process.env.GP_CLIENT_ID);
console.log("ENV CHECK → GP_CLIENT_SECRET exists?", !!process.env.GP_CLIENT_SECRET);
console.log("ENV CHECK → GP_REFRESH_TOKEN exists?", !!process.env.GP_REFRESH_TOKEN);

// ---- OAuth helper ----
function oauth() {
  return new google.auth.OAuth2(
    process.env.GP_CLIENT_ID,
    process.env.GP_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// ---- My Business v4 client (discovery fallback) ----
async function getMyBizV4(auth) {
  if (google.mybusiness) return google.mybusiness({ version: "v4", auth });
  const disc = await google.discoverAPI("https://mybusiness.googleapis.com/$discovery/rest?version=v4");
  disc.context._options.auth = auth;
  return disc;
}

/* ======================= Sağlık / Hızlı Test ======================= */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    port: PORT,
    env: {
      PLACES_API_KEY: !!process.env.PLACES_API_KEY,
      PLACE_ID: !!process.env.PLACE_ID,
      GP_CLIENT_ID: !!process.env.GP_CLIENT_ID,
      GP_CLIENT_SECRET: !!process.env.GP_CLIENT_SECRET,
      GP_REFRESH_TOKEN: !!process.env.GP_REFRESH_TOKEN,
    },
    routes: [
      "/auth",
      "/oauth2callback",
      "/api/debug/account-v1",
      "/api/debug/account-v4",
      "/api/reviews",
      "/api/places-reviews",
    ],
  });
});

/* ======================= OAuth akışı ======================= */

// 1) Yetkilendirme bağlantısı (refresh_token almak için bir kez)
app.get("/auth", (req, res) => {
  const o = oauth();
  const url = o.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
  });
  res.redirect(url);
});

// 2) Google dönüş adresi
app.get("/oauth2callback", async (req, res) => {
  try {
    const o = oauth();
    const { tokens } = await o.getToken({ code: req.query.code, redirect_uri: REDIRECT_URI });
    res.send(
      `<pre>REFRESH TOKEN (.env'ye ekle: GP_REFRESH_TOKEN=...):\n${tokens.refresh_token || "(gelmedi — hesap izinlerini sıfırlayıp /auth'u tekrar deneyin)"}\n\nTÜM TOKENLAR:\n${JSON.stringify(tokens, null, 2)}</pre>`
    );
  } catch (e) {
    res.status(500).send(String(e));
  }
});

/* ======================= Debug (ID bulma) ======================= */

// v1 ile accountId getir (allowlist gerekmez; kota için cache+backoff var)
app.get("/api/debug/account-v1", async (_req, res) => {
  try {
    if (!process.env.GP_REFRESH_TOKEN) {
      return res.status(400).json({ error: "Önce /auth ile refresh token alın (.env → GP_REFRESH_TOKEN)" });
    }

    const hit = debugCache.get("accountList");
    if (hit) return res.json(hit);

    const o = oauth();
    o.setCredentials({ refresh_token: process.env.GP_REFRESH_TOKEN });
    const mgmt = google.mybusinessaccountmanagement({ version: "v1", auth: o });

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    async function callWithBackoff() {
      for (let i = 0; i < 5; i++) {
        try {
          return await mgmt.accounts.list();
        } catch (e) {
          const s = String(e).toLowerCase();
          if (s.includes("quota") || s.includes("rate") || s.includes("per minute") || s.includes("429")) {
            await sleep(65000); // dakikalık kota için güvenli bekleme
          } else {
            throw e;
          }
        }
      }
      throw new Error("Too many retries (quota)");
    }

    const resp = await callWithBackoff();
    const accounts = (resp.data.accounts || []).map(a => ({
      accountId: (a.name || "").split("/")[1],
      rawName: a.name,
      accountName: a.accountName || a.orgName || ""
    }));

    const payload = { accounts };
    debugCache.set("accountList", payload);
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// v4 ile accountId (allowlist varsa çalışır)
app.get("/api/debug/account-v4", async (_req, res) => {
  try {
    if (!process.env.GP_REFRESH_TOKEN) {
      return res.status(400).json({ error: "Önce /auth ile refresh token alın (.env → GP_REFRESH_TOKEN)" });
    }
    const o = oauth(); o.setCredentials({ refresh_token: process.env.GP_REFRESH_TOKEN });
    const mybiz = await getMyBizV4(o);

    const resp = await mybiz.accounts.list({});
    const accounts = (resp.data.accounts || []).map(a => ({
      accountId: (a.name || "").split("/")[1],
      rawName: a.name
    }));
    res.json({ accounts });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/* ======================= Tüm yorumlar (GBP v4) ======================= */
// Not: Bu uç için GBP v4 allowlist gerekir. Yoksa 403 verir.
app.get("/api/reviews", async (req, res) => {
  try {
    if (!process.env.GP_REFRESH_TOKEN) {
      return res.status(400).json({ error: "Önce /auth ile refresh token alın (.env → GP_REFRESH_TOKEN)" });
    }

    const accountId  = process.env.GP_ACCOUNT_ID || req.query.accountId;
    const locationId = process.env.GP_LOCATION_ID || req.query.locationId;
    if (!accountId || !locationId) {
      return res.status(400).json({ error: "accountId & locationId gerekli (query ile verin ya da .env'ye yazın)." });
    }

    const key = `rev:${accountId}:${locationId}`;
    const hit = cache.get(key);
    if (hit) return res.json(hit);

    const o = oauth(); o.setCredentials({ refresh_token: process.env.GP_REFRESH_TOKEN });
    const mybiz = await getMyBizV4(o);

    const parent = `accounts/${accountId}/locations/${locationId}`;
    let reviews = [], pageToken;

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    async function pageCall(pt) {
      for (let i = 0; i < 5; i++) {
        try {
          return await mybiz.accounts.locations.reviews.list({
            parent, pageSize: 50, orderBy: "updateTime desc", pageToken: pt
          });
        } catch (err) {
          const s = String(err).toLowerCase();
          if (s.includes("quota") || s.includes("rate") || s.includes("429")) await sleep(1200 * (i + 1));
          else throw err;
        }
      }
      throw new Error("Too many failed attempts");
    }

    do {
      const r = await pageCall(pageToken);
      reviews.push(...(r.data.reviews || []));
      pageToken = r.data.nextPageToken;
    } while (pageToken);

    const out = {
      count: reviews.length,
      reviews: reviews.map(r => ({
        id: r.reviewId,
        rating: r.starRating, // ONE..FIVE
        comment: r.comment || "",
        reviewer: r.reviewer?.displayName || "Anonim",
        photo: r.reviewer?.profilePhotoUrl || "",
        createTime: r.createTime,
        ownerReply: r.reviewReply?.comment || ""
      }))
    };

    cache.set(key, out);
    res.json(out);
  } catch (e) {
    const msg = String(e);
    if (msg.includes("Method not found") || msg.includes('"status":"NOT_FOUND"')) {
      return res.status(403).json({
        error: "GBP v4 reviews erişimi yok",
        hint: "Projeniz GBP v4 için allowlist değil. Access formu ile başvurup onay gelince tekrar deneyin."
      });
    }
    res.status(500).json({ error: "fetch failed", detail: msg });
  }
});

/* ======================= Places (max 5 yorum) ======================= */
app.get("/api/places-reviews", async (req, res) => {
  try {
    const apiKey = process.env.PLACES_API_KEY;
    const placeId = process.env.PLACE_ID || req.query.placeId;
    if (!apiKey || !placeId) {
      return res.status(400).json({ error: "PLACES_API_KEY ve PLACE_ID gerekli (env veya ?placeId=...)" });
    }

    const key = `places:${placeId}`;
    const hit = cache.get(key);
    if (hit) return res.json(hit);

    const params = new URLSearchParams({
      place_id: placeId,
      key: apiKey,
      language: "tr",
      fields: ["name", "url", "rating", "user_ratings_total", "reviews"].join(","),
      reviews_sort: "newest", // veya "most_relevant"
    });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== "OK") {
      return res.status(502).json({ error: "Places API error", detail: data.status, message: data.error_message });
    }

    const r = data.result || {};
    const reviews = (r.reviews || []).map((x) => ({
      authorName: x.author_name,
      profilePhotoUrl: x.profile_photo_url,
      rating: x.rating, // 1..5
      text: x.text,
      time: x.time, // epoch
      relativeTime: x.relative_time_description,
      language: x.language,
      authorUrl: x.author_url
    }));

    const payload = {
      name: r.name,
      url: r.url, // Google Harita sayfası
      rating: r.rating,
      total: r.user_ratings_total,
      count: reviews.length,
      reviews
    };

    cache.set(key, payload); // 15 dk
    res.json(payload);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

/* ======================= Listen ======================= */
const server = app.listen(PORT, () => {
  console.log(`OAuth:     http://localhost:${PORT}/auth`);
  console.log(`Account v1:http://localhost:${PORT}/api/debug/account-v1`);
  console.log(`Account v4:http://localhost:${PORT}/api/debug/account-v4`);
  console.log(`Reviews:   http://localhost:${PORT}/api/reviews`);
  console.log(`Places:    http://localhost:${PORT}/api/places-reviews`);
});
server.on("error", (err) => {
  console.error("Listen error:", err.code, err.message);
  if (err.code === "EADDRINUSE") console.error(`Port ${PORT} kullanımda. Başka süreci kapatın veya .env'de PORT'u değiştirin.`);
});
