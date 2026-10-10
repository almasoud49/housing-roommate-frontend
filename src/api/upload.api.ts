import apiClient from "@/lib/apiClient";
import type { ApiResponse, UploadSignature } from "@/types";

export type UploadFolder =
  | "avatar"
  | "verification"
  | "maintenance"
  | "documents"
  | "properties"
  | "buildings"
  | "flats"
  | "rooms"
  | "misc";

export type UploadResourceType = "image" | "video" | "raw" | "auto";

/** Ask the backend to sign a direct-to-Cloudinary upload. */
export function getUploadSignature(payload: {
  folder?: UploadFolder;
  resourceType?: UploadResourceType;
  publicIdSuffix?: string;
}) {
  return apiClient<ApiResponse<UploadSignature>>("/uploads/signature", { method: "POST", body: payload });
}
