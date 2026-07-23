import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { deleteMediaFn, listMediaFn } from "@/lib/api/cms.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isVideoMime, uploadAdminFile } from "@/lib/admin/upload";

export const Route = createFileRoute("/admin/media")({
  loader: () => listMediaFn(),
  component: MediaPage,
});

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

function MediaPage() {
  const items = Route.useLoaderData();
  const router = useRouter();
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      await uploadAdminFile(file, alt || file.name);
      toast.success(isVideoMime(file.type) ? "Video uploaded" : "Image uploaded");
      setAlt("");
      router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this media file?")) return;
    try {
      await deleteMediaFn({ data: { id } });
      toast.success("Deleted");
      router.invalidate();
    } catch {
      toast.error("Delete failed");
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Media library</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Upload images (max 8MB) and videos (max 40MB). Use them in Page content, Rooms, or Settings.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="space-y-2">
          <Label>Alt / label</Label>
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Optional" />
        </div>
        <label className="inline-flex">
          <span
            className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white shadow transition hover:bg-zinc-800 ${
              uploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {uploading ? "Uploading…" : "Upload image or video"}
          </span>
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const video = isVideoUrl(item.url);
          return (
            <div key={item.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              {video ? (
                <video
                  src={item.url}
                  className="aspect-video w-full bg-zinc-950 object-contain"
                  controls
                  muted
                  playsInline
                />
              ) : (
                <img src={item.url} alt={item.alt} className="aspect-video w-full object-cover" />
              )}
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium">
                  {item.filename}
                  {video ? (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-700">
                      Video
                    </span>
                  ) : null}
                </p>
                <Input
                  readOnly
                  value={item.url}
                  onFocus={(e) => e.target.select()}
                  className="font-mono text-xs"
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => void copy(item.url)}>
                    Copy URL
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
