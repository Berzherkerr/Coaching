export function openWhatsApp(url) {
  window.dispatchEvent(new CustomEvent("wa-confirm", { detail: { url } }));
}
