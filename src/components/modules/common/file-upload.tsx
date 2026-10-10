"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUploadFile } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { UploadFolder, UploadResourceType } from "@/api";

/**
 * Signed Cloudinary upload. Calls `onUploaded(urls)` with the public URLs of
 * every file picked (uploaded sequentially).
 */
export function FileUpload({
  folder,
  resourceType,
  multiple,
  accept,
  label = "Upload file",
  onUploaded,
}: {
  folder: UploadFolder;
  resourceType?: UploadResourceType;
  multiple?: boolean;
  accept?: string;
  label?: string;
  onUploaded: (urls: string[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { mutateAsync, isPending } = useUploadFile();

  const handle = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await mutateAsync({ file, folder, resourceType }));
      }
      onUploaded(urls);
      toast.success(urls.length > 1 ? `${urls.length} files uploaded` : "File uploaded");
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={ref}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        onChange={(e) => handle(e.target.files)}
      />
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => ref.current?.click()}>
        {isPending ? "Uploading..." : label}
      </Button>
    </>
  );
}
