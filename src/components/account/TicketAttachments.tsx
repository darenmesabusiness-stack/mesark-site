"use client";
import { uploadPresigned } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAX_UPLOAD, UPLOAD_TYPES } from "@/lib/supportUploadTypes";

export function TicketAttachments({ ticket }: { ticket: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <form
      className="mt-6 grid gap-3 border-t border-border pt-6"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const file = new FormData(form).get("file");
        if (
          !(file instanceof File) ||
          !Object.hasOwn(UPLOAD_TYPES,file.type) ||
          file.size < 1 ||
          file.size > MAX_UPLOAD
        ) {
          setMessage("Choose a supported file up to 32 MB.");
          return;
        }
        setBusy(true);
        setMessage("");
        try {
          const id = crypto.randomUUID();
          await uploadPresigned(
            `support/${ticket}/${id}.${UPLOAD_TYPES[file.type]}`,
            file,
            {
              access: "private",
              handleUploadUrl: "/api/support/upload",
              contentType: file.type,
              multipart: file.size > 4 * 1024 * 1024,
              clientPayload: JSON.stringify({
                ticket,
                id,
                name: file.name,
                mime: file.type,
                bytes: file.size,
              }),
            },
          );
          form.reset();
          setMessage(
            "Uploaded. The file will appear once processing finishes.",
          );
          router.refresh();
        } catch {
          setMessage(
            "Upload failed. Check your file and ticket access, then retry.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="text-sm">
        Attach a screenshot, video or document
        <input
          name="file"
          type="file"
          required
          accept={Object.keys(UPLOAD_TYPES).join(",")}
          disabled={busy}
          className="mt-2 block w-full text-sm"
        />
      </label>
      <p className="text-xs text-text-muted">
        Private files · JPG, PNG, GIF, WebP, MP4, WebM, PDF or text · 32 MB per
        file
      </p>
      <button
        disabled={busy}
        className="justify-self-start border border-accent px-4 py-2 text-sm text-accent disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload attachment"}
      </button>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </form>
  );
}
