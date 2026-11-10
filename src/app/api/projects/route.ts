import { orderedProjects } from "@/server/queries";
import { projectResource } from "@/server/resources";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ data: (await orderedProjects()).map(projectResource) });
}
