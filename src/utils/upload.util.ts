import { getUploadSignature, type UploadFolder, type UploadResourceType } from "@/api/upload.api";

/**
 * Signed direct upload to Cloudinary:
 * 1. POST /uploads/signature (backend signs timestamp/folder/public_id)
 * 2. POST the file + signed params to the returned `uploadUrl`
 * Resolves with the public `secure_url`.
 */
export async function uploadFile(
  file: File,
  opts: { folder?: UploadFolder; resourceType?: UploadResourceType } = {},
): Promise<string> {
  const { folder = "misc", resourceType = file.type.startsWith("image/") ? "image" : "raw" } = opts;
  const res = await getUploadSignature({ folder, resourceType });
  const sig = res.data;

  if (file.size > sig.maxBytes) {
    throw new Error(`File is too large (max ${Math.round(sig.maxBytes / 1024 / 1024)} MB)`);
  }

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  form.append("public_id", sig.publicId);

  const upload = await fetch(sig.uploadUrl, { method: "POST", body: form });
  const json = await upload.json();
  if (!upload.ok || !json.secure_url) {
    throw new Error(json?.error?.message ?? "Upload failed");
  }
  return json.secure_url as string;
}
