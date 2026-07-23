import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isImageMime, isVideoMime, uploadAdminFile } from "@/lib/admin/upload";
import { toast } from "sonner";

export function MediaUploadField({
  label,
  value,
  onChange,
  accept = "image/*,video/*",
  altText,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  altText?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const looksVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(value);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const okImage = isImageMime(file.type);
    const okVideo = isVideoMime(file.type);
    const acceptImages = accept.includes("image");
    const acceptVideos = accept.includes("video");
    if ((okImage && !acceptImages) || (okVideo && !acceptVideos) || (!okImage && !okVideo)) {
      toast.error("Unsupported file type");
      return;
    }
    setUploading(true);
    try {
      const result = await uploadAdminFile(file, altText);
      onChange(result.url);
      toast.success(okVideo ? "Video uploaded" : "Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/..."
          className="min-w-[200px] flex-1 font-mono text-xs"
        />
        <label className="inline-flex">
          <span
            className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 ${
              uploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {uploading ? "Uploading…" : "Upload"}
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
      {value.trim() ? (
        looksVideo ? (
          <video
            src={value}
            className="mt-2 max-h-48 w-full max-w-md rounded border bg-zinc-950 object-contain"
            controls
            muted
            playsInline
          />
        ) : (
          <img
            src={value}
            alt=""
            className="mt-2 h-32 w-full max-w-md rounded object-cover"
          />
        )
      ) : null}
    </div>
  );
}
