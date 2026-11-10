import "server-only";

/** A successful dashboard response: where to go next and the toast to show. */
export function done(body: { redirect?: string; flash?: string } = {}): Response {
  return Response.json(body);
}

export function notFound(message = "Not found."): Response {
  return Response.json({ message }, { status: 404 });
}
