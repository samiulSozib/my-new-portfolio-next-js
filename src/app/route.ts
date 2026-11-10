// The bare root goes to Bengali if the browser prefers it, English otherwise.
export function GET(request: Request) {
  const accepted = (request.headers.get("accept-language") ?? "").toLowerCase();
  const lang = accepted.startsWith("bn") || accepted.includes(",bn") ? "bn" : "en";

  return new Response(null, {
    status: 302,
    headers: { Location: new URL(`/${lang}`, request.url).toString(), Vary: "Accept-Language" },
  });
}
