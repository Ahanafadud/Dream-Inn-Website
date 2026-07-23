import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  getSettingsFn,
  updateSettingsFn,
  uploadMediaFn,
  type SiteSettings,
} from "@/lib/api/cms.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  loader: () => getSettingsFn(),
  component: SettingsPage,
});

const FIELDS: { key: keyof SiteSettings; label: string; multiline?: boolean }[] = [
  { key: "brandGroup", label: "Brand group (top header)" },
  { key: "brandWordmark", label: "Wordmark" },
  { key: "brandSub", label: "Brand subtitle" },
  { key: "seoTitle", label: "SEO title" },
  { key: "seoDescription", label: "SEO description", multiline: true },
  { key: "ogTitle", label: "OG title" },
  { key: "ogDescription", label: "OG description", multiline: true },
  { key: "ogImage", label: "OG image URL" },
  { key: "highlightEmail", label: "Highlight email" },
  { key: "highlightPhone", label: "Highlight phone" },
  { key: "reservationsEmail", label: "Reservations email" },
  { key: "reservationsPhone", label: "Reservations phone" },
  { key: "dineEmail", label: "Dine email" },
  { key: "dinePhone", label: "Dine phone" },
  { key: "resideEmail", label: "Reside email" },
  { key: "residePhone", label: "Reside phone" },
  { key: "conciergeEmail", label: "Concierge email" },
  { key: "conciergeWhatsapp", label: "Concierge WhatsApp (intl, no +)" },
  { key: "locationAddress", label: "Location address" },
  { key: "locationReservations", label: "Location reservations" },
  { key: "locationConcierge", label: "Location concierge" },
  { key: "locationAirport", label: "Airport note" },
  { key: "locationRail", label: "Rail note" },
  { key: "manageBookingLabel", label: "Manage booking label" },
  { key: "signInLabel", label: "Sign in label" },
  { key: "languageLabel", label: "Language label" },
];

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function SettingsPage() {
  const initial = Route.useLoaderData();
  const [form, setForm] = useState<SiteSettings>({
    logoUrl: "",
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateSettingsFn({ data: form as unknown as Record<string, unknown> });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadMediaFn({
        data: {
          filename: file.name,
          mimeType: file.type || "image/png",
          base64,
          alt: "Header logo",
        },
      });
      setForm((f) => ({ ...f, logoUrl: result.url }));
      toast.success("Logo uploaded — click Save changes");
    } catch {
      toast.error("Logo upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Brand, logo, SEO, phones, emails, and WhatsApp — used across the whole site.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="mt-8 space-y-3 rounded-xl border border-zinc-200 bg-white p-5 sm:col-span-2">
        <Label>Header logo</Label>
        <p className="text-xs text-zinc-500">
          Shown beside the brand name in the header and footer. Upload a PNG or SVG with a transparent background for best results.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-28 items-center justify-center rounded border border-dashed border-zinc-300 bg-zinc-950">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Logo preview" className="max-h-12 max-w-[6.5rem] object-contain" />
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">No logo</span>
            )}
          </div>
          <div className="min-w-[220px] flex-1 space-y-2">
            <Input
              value={form.logoUrl ?? ""}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="/uploads/logo.png"
            />
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex">
                <span
                  className={`inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 ${
                    uploading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {uploading ? "Uploading…" : "Upload logo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadLogo(file);
                    e.target.value = "";
                  }}
                />
              </label>
              {form.logoUrl ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  onClick={() => setForm({ ...form, logoUrl: "" })}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="logoHeaderHeight">Header height (px)</Label>
            <Input
              id="logoHeaderHeight"
              type="number"
              min={16}
              max={120}
              value={form.logoHeaderHeight ?? "48"}
              onChange={(e) => setForm({ ...form, logoHeaderHeight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoHeaderWidth">Header width (px)</Label>
            <Input
              id="logoHeaderWidth"
              type="number"
              min={16}
              max={240}
              value={form.logoHeaderWidth ?? ""}
              onChange={(e) => setForm({ ...form, logoHeaderWidth: e.target.value })}
              placeholder="auto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoFooterHeight">Footer height (px)</Label>
            <Input
              id="logoFooterHeight"
              type="number"
              min={16}
              max={120}
              value={form.logoFooterHeight ?? "40"}
              onChange={(e) => setForm({ ...form, logoFooterHeight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoFooterWidth">Footer width (px)</Label>
            <Input
              id="logoFooterWidth"
              type="number"
              min={16}
              max={240}
              value={form.logoFooterWidth ?? ""}
              onChange={(e) => setForm({ ...form, logoFooterWidth: e.target.value })}
              placeholder="auto"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          Leave width empty to keep aspect ratio (auto). Height defaults: header 48px, footer 40px.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.multiline ? "sm:col-span-2 space-y-2" : "space-y-2"}>
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.multiline ? (
              <Textarea
                id={f.key}
                rows={3}
                value={String(form[f.key] ?? "")}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            ) : (
              <Input
                id={f.key}
                value={String(form[f.key] ?? "")}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
