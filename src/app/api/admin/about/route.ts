import { done } from "@/server/admin-api";
import { aboutSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { revalidateSite } from "@/server/revalidate";
import { storeSetting } from "@/server/settings";
import { validate } from "@/server/validation";

export async function PUT(request: Request) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const data = await validate(request, aboutSchema);
  if (data instanceof Response) return data;

  await storeSetting("profile", data);
  revalidateSite();
  return done({ flash: "About page saved." });
}
