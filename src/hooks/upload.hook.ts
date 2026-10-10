import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/utils/upload.util";
import type { UploadFolder, UploadResourceType } from "@/api";

/** Upload one file to Cloudinary via a backend-signed request; resolves with the public URL. */
export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, folder, resourceType }: { file: File; folder?: UploadFolder; resourceType?: UploadResourceType }) =>
      uploadFile(file, { folder, resourceType }),
  });
}
