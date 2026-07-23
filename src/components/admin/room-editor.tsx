import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadAdminFile } from "@/lib/admin/upload";
import { toast } from "sonner";

export type RoomFormData = {
  name: string;
  slug: string;
  tagline: string;
  size: string;
  price: string;
  description: string;
  primaryImageUrl: string;
  sortOrder: number;
  gallery: { url: string; caption: string }[];
  numbers: string[];
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function RoomEditor({
  initial,
  onSave,
}: {
  initial: RoomFormData;
  onSave: (data: RoomFormData) => Promise<void>;
}) {
  const [form, setForm] = useState<RoomFormData>(initial);
  const [numbersText, setNumbersText] = useState(initial.numbers.join(", "));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File, asPrimary = false) => {
    setUploading(true);
    try {
      const result = await uploadAdminFile(file, form.name || file.name);
      if (asPrimary) {
        setForm((f) => ({
          ...f,
          primaryImageUrl: result.url,
          gallery: f.gallery.length
            ? f.gallery
            : [{ url: result.url, caption: f.name || "Primary" }],
        }));
      } else {
        setForm((f) => ({
          ...f,
          gallery: [...f.gallery, { url: result.url, caption: "" }],
          primaryImageUrl: f.primaryImageUrl || result.url,
        }));
      }
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
          await onSave({
            ...form,
            slug: form.slug || slugify(form.name),
            numbers: numbersText
              .split(/[,\n]/)
              .map((n) => n.trim())
              .filter(Boolean),
          });
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({
                ...f,
                name,
                slug: f.slug || slugify(name),
              }));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Size</Label>
          <Input
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Sort order</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm({ ...form, sortOrder: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Description</Label>
          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Room numbers (comma-separated)</Label>
          <Textarea
            rows={2}
            value={numbersText}
            onChange={(e) => setNumbersText(e.target.value)}
            placeholder="201, 202, 203"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <Label>Primary image</Label>
          <label className="cursor-pointer text-sm text-blue-600 hover:underline">
            {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file, true);
              }}
            />
          </label>
        </div>
        <Input
          value={form.primaryImageUrl}
          onChange={(e) => setForm({ ...form, primaryImageUrl: e.target.value })}
          placeholder="/uploads/..."
        />
        {form.primaryImageUrl && (
          <img
            src={form.primaryImageUrl}
            alt=""
            className="mt-2 h-40 w-full max-w-md rounded object-cover"
          />
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <Label>Gallery</Label>
          <label className="cursor-pointer text-sm text-blue-600 hover:underline">
            Add image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file, false);
              }}
            />
          </label>
        </div>
        <div className="space-y-3">
          {form.gallery.map((g, idx) => (
            <div key={idx} className="flex flex-wrap items-start gap-3 rounded-lg border p-3">
              <img src={g.url} alt="" className="h-16 w-24 rounded object-cover" />
              <div className="min-w-[200px] flex-1 space-y-2">
                <Input
                  value={g.url}
                  onChange={(e) => {
                    const gallery = [...form.gallery];
                    gallery[idx] = { ...g, url: e.target.value };
                    setForm({ ...form, gallery });
                  }}
                />
                <Input
                  placeholder="Caption"
                  value={g.caption}
                  onChange={(e) => {
                    const gallery = [...form.gallery];
                    gallery[idx] = { ...g, caption: e.target.value };
                    setForm({ ...form, gallery });
                  }}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setForm({
                    ...form,
                    gallery: form.gallery.filter((_, i) => i !== idx),
                  })
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={saving || uploading}>
        {saving ? "Saving…" : "Save room"}
      </Button>
    </form>
  );
}
