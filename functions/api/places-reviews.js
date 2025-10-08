// Cloudflare Pages Function: /api/places-reviews
// Ortam değişkenleri: PLACES_API_KEY, PLACE_ID  (Pages > Settings > Environment variables)

export async function onRequest({ env }) {
  try {
    const apiKey  = env.PLACES_API_KEY;
    const placeId = env.PLACE_ID;

    if (!apiKey || !placeId) {
      return new Response(
        JSON.stringify({ error: "PLACES_API_KEY ve PLACE_ID gerekli (Cloudflare Pages Settings > Variables)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const params = new URLSearchParams({
      place_id: placeId,
      key: apiKey,
      language: "tr",
      fields: ["name", "url", "rating", "user_ratings_total", "reviews"].join(","),
      reviews_sort: "newest",
    });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== "OK") {
      return new Response(JSON.stringify({
        error: "Places API error",
        detail: data.status,
        message: data.error_message || null,
      }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    // Frontend’in beklediği sade format
    const r = data.result || {};
    const reviews = (r.reviews || []).map(x => ({
      authorName: x.author_name,
      profilePhotoUrl: x.profile_photo_url,
      rating: x.rating,
      text: x.text,
      time: x.time,
      relativeTime: x.relative_time_description,
      language: x.language,
      authorUrl: x.author_url,
    }));

    return new Response(JSON.stringify({
      name: r.name,
      url: r.url,
      rating: r.rating,
      total: r.user_ratings_total,
      count: reviews.length,
      reviews,
    }), { headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=900" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
