"use client";

import { useState } from "react";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useMyVerificationStatus, useUploadVerificationDocs } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUpload, PageHeader } from "@/components/modules/common";

export default function VerificationPage() {
  const { data, isLoading } = useMyVerificationStatus();
  const { mutate: submit, isPending } = useUploadVerificationDocs();
  const [docs, setDocs] = useState<string[]>([]);
  const status = data?.data;

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Identity Verification" description="Upload an ID document so landlords can trust your applications." />
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-6">
          {status?.isVerified ? <BadgeCheck className="size-10 text-green-500" /> : <ShieldAlert className="size-10 text-yellow-500" />}
          <div>
            <p className="font-semibold">{status?.isVerified ? "Verified" : status?.verificationDocs?.length ? "Under review" : "Not verified"}</p>
            <p className="text-sm text-muted-foreground">
              {status?.isVerified
                ? "Your identity has been verified."
                : status?.verificationDocs?.length
                  ? "An admin is reviewing your documents."
                  : "Submit at least one document to start verification."}
            </p>
          </div>
        </CardContent>
      </Card>

      {!!status?.verificationDocs?.length && (
        <div className="mb-6">
          <h2 className="mb-2 font-semibold">Submitted documents</h2>
          <ul className="space-y-1 text-sm">
            {status.verificationDocs.map((u, i) => (
              <li key={u}><a className="text-primary underline" href={u} target="_blank" rel="noreferrer">Document {i + 1}</a></li>
            ))}
          </ul>
        </div>
      )}

      {!status?.isVerified && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold">{status?.verificationDocs?.length ? "Submit new documents" : "Submit documents"}</h2>
            <p className="text-sm text-muted-foreground">Up to 5 files (images or PDFs). Uploaded securely to Cloudinary.</p>
            {!!docs.length && (
              <ul className="space-y-1 text-sm">
                {docs.map((u, i) => (
                  <li key={u} className="flex items-center justify-between">
                    <a className="text-primary underline" href={u} target="_blank" rel="noreferrer">Attachment {i + 1}</a>
                    <button type="button" className="text-xs text-destructive" onClick={() => setDocs(docs.filter((x) => x !== u))}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-3">
              {docs.length < 5 && (
                <FileUpload folder="verification" resourceType="auto" accept="image/*,application/pdf" multiple label="Choose files" onUploaded={(urls) => setDocs([...docs, ...urls].slice(0, 5))} />
              )}
              <Button
                size="sm"
                disabled={!docs.length || isPending}
                onClick={() =>
                  submit(docs, {
                    onSuccess: () => { toast.success("Documents submitted for review"); setDocs([]); },
                    onError: (e) => toast.error(getErrorMessage(e)),
                  })
                }
              >
                {isPending ? "Submitting..." : "Submit for review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
