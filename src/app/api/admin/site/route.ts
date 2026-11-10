import { done } from "@/server/admin-api";
import { siteSchema } from "@/server/admin-validation";
import { authorizeAdmin } from "@/server/auth";
import { revalidateSite } from "@/server/revalidate";
import { storeSetting } from "@/server/settings";
import { validate } from "@/server/validation";

export async function PUT(request: Request) {
  const auth = await authorizeAdmin();
  if (auth instanceof Response) return auth;

  const data = await validate(request, siteSchema);
  if (data instanceof Response) return data;

  await storeSetting("site", data);
  revalidateSite();
  return done({ flash: "Site settings saved." });
}
