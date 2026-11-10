import { orderedExperiences } from "@/server/queries";
import { experienceResource } from "@/server/resources";

export const dynamic = "force-dynamic";

// The work history, current roles first.
export async function GET() {
  return Response.json({ data: (await orderedExperiences()).map(experienceResource) });
}
