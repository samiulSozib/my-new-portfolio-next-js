import { done } from "@/server/admin-api";
import { experienceRow } from "@/server/admin-experience";
import { experienceSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { experiences } from "@/server/db/schema";
import { revalidateSite } from "@/server/revalidate";
import { validate } from "@/server/validation";

export async function POST(request: Request) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const data = await validate(request, experienceSchema);
  if (data instanceof Response) return data;

  await db.insert(experiences).values(experienceRow(data));
  revalidateSite();
  return done({ redirect: "/admin/experience", flash: "Role added." });
}
