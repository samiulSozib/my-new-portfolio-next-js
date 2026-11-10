import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { blobMissing, UPLOAD_RULES, type UploadKind } from "@/server/admin-blob";
import { getCurrentUser } from "@/server/auth";

/**
 * Issues short-lived tokens so the browser can upload the CV or photo straight to Vercel Blob.
 * The file never passes through this function, so the ~4.5 MB request body limit does not apply.
 * After the upload, the browser records it with POST /api/admin/resume/cv (or /photo).
 */
export async function POST(request: Request) {
  const missing = blobMissing();
  if (missing) return missing;

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const user = await getCurrentUser();
        if (!user?.isAdmin) throw new Error("Only site admins can upload files.");

        const kind = clientPayload as UploadKind;
        const rules = UPLOAD_RULES[kind];
        if (!rules) throw new Error("Unknown upload type.");
        if (!pathname.startsWith(rules.folder)) throw new Error("Invalid upload path.");

        return {
          allowedContentTypes: [...rules.contentTypes],
          maximumSizeInBytes: rules.maxBytes,
          addRandomSuffix: true,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}
