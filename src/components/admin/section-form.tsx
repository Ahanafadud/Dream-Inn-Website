import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_SECTIONS } from "@/lib/cms/defaults";
import { MediaUploadField } from "@/components/admin/media-upload-field";

export const SECTION_LABELS: Record<string, string> = {
  ui: "Site labels (buttons & placeholders)",
  nav: "Navigation links",
  hero: "Hero",
  about: "About",
  categories: "Room categories",
  highlight: "Highlight",
  stay: "Stay mosaic",
  suites: "Suites section",
  dine: "Dine",
  reside: "Reside",
  wellness: "Wellness",
  experience: "Experience",
  location: "Location",
  concierge: "Concierge",
  footer: "Footer",
};

type FieldDef =
  | { kind: "text"; key: string; label: string }
  | { kind: "textarea"; key: string; label: string; rows?: number }
  | { kind: "image"; key: string; label: string; altKey?: string; hint?: string }
  | { kind: "video"; key: string; label: string; hint?: string }
  | { kind: "links"; key: string; label: string }
  | { kind: "stats"; key: string; label: string }
  | { kind: "slides"; key: string; label: string }
  | { kind: "experienceItems"; key: string; label: string }
  | { kind: "stringList"; key: string; label: string; hint?: string };

const SECTION_FIELDS: Record<string, FieldDef[]> = {
  ui: [
    { kind: "text", key: "selectedPrefix", label: "Selected prefix" },
    { kind: "text", key: "clearLabel", label: "Clear button" },
    { kind: "text", key: "suitePlaceholder", label: "Suite dropdown placeholder" },
    { kind: "text", key: "datesPlaceholder", label: "Dates placeholder" },
    { kind: "text", key: "adultsLabel", label: "Adults label" },
    { kind: "text", key: "childrenLabel", label: "Children label" },
    { kind: "text", key: "findRoomsLabel", label: "Find rooms button" },
    { kind: "text", key: "menuAriaLabel", label: "Mobile menu label" },
    { kind: "text", key: "whatsappAriaLabel", label: "WhatsApp icon label" },
  ],
  nav: [{ kind: "links", key: "links", label: "Menu links" }],
  hero: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "textarea", key: "headline", label: "Headline (use line breaks)", rows: 3 },
    { kind: "textarea", key: "body", label: "Body", rows: 4 },
    {
      kind: "video",
      key: "videoUrl",
      label: "Hero video",
      hint: "Upload MP4/WebM (max 40MB). Plays muted & looping. Image below is used as poster/fallback.",
    },
    {
      kind: "image",
      key: "imageUrl",
      label: "Hero image / video poster",
      altKey: "imageAlt",
      hint: "Shown when no video, or as the video poster frame.",
    },
  ],
  about: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "textarea", key: "body", label: "Body", rows: 4 },
    { kind: "stats", key: "stats", label: "Stats" },
  ],
  categories: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "textarea", key: "intro", label: "Intro", rows: 3 },
    { kind: "text", key: "selectLabel", label: "Select label" },
    { kind: "text", key: "selectedLabel", label: "Selected label" },
    { kind: "text", key: "roomNumbersLabel", label: "Room numbers label" },
    { kind: "text", key: "fromLabel", label: "Price “From” label" },
    { kind: "text", key: "bookCta", label: "Book CTA" },
  ],
  highlight: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "textarea", key: "body", label: "Body", rows: 5 },
    { kind: "text", key: "ctaLabel", label: "CTA label" },
    { kind: "text", key: "ctaHref", label: "CTA link (e.g. #suites)" },
    { kind: "image", key: "imageMain", label: "Main image URL", altKey: "imageMainAlt" },
    { kind: "image", key: "imageTop", label: "Top image URL", altKey: "imageTopAlt" },
    { kind: "image", key: "imageBottom", label: "Bottom image URL", altKey: "imageBottomAlt" },
    { kind: "text", key: "awardYear", label: "Award year" },
    { kind: "text", key: "awardName", label: "Award name" },
    { kind: "text", key: "awardSubtitle", label: "Award subtitle" },
  ],
  stay: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "text", key: "bookNowLabel", label: "Book Now button" },
    {
      kind: "stringList",
      key: "tileSlugs",
      label: "Room tile slugs (order = mosaic order)",
      hint: "Use room slugs from Rooms admin, one per line",
    },
  ],
  suites: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "textarea", key: "intro", label: "Intro", rows: 3 },
    { kind: "text", key: "viewGalleryLabel", label: "View gallery label" },
    { kind: "text", key: "exploreGalleryLabel", label: "Explore gallery label" },
    { kind: "text", key: "hideGalleryLabel", label: "Hide gallery label" },
    { kind: "text", key: "perNightLabel", label: "Per night label" },
    { kind: "text", key: "reserveLabel", label: "Reserve button" },
  ],
  dine: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "textarea", key: "body", label: "Body", rows: 4 },
    { kind: "image", key: "image1", label: "Image 1 URL", altKey: "image1Alt" },
    { kind: "image", key: "image2", label: "Image 2 URL", altKey: "image2Alt" },
    { kind: "text", key: "discoverLabel", label: "Discover button" },
    { kind: "text", key: "reserveLabel", label: "Reserve button" },
  ],
  reside: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "textarea", key: "body", label: "Body", rows: 4 },
    { kind: "image", key: "imageUrl", label: "Image URL", altKey: "imageAlt" },
    { kind: "text", key: "ctaLabel", label: "CTA button" },
  ],
  wellness: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "text", key: "ctaLabel", label: "CTA button" },
    { kind: "slides", key: "slides", label: "Carousel slides" },
  ],
  experience: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "textarea", key: "headline", label: "Headline (line breaks OK)", rows: 3 },
    { kind: "experienceItems", key: "items", label: "Experience cards" },
  ],
  location: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "textarea", key: "headline", label: "Headline", rows: 2 },
    { kind: "textarea", key: "body", label: "Body", rows: 3 },
    { kind: "text", key: "addressLabel", label: "Address row label" },
    { kind: "text", key: "reservationsLabel", label: "Reservations row label" },
    { kind: "text", key: "conciergeLabel", label: "Concierge row label" },
    { kind: "text", key: "airportLabel", label: "Airport row label" },
    { kind: "text", key: "railLabel", label: "Rail row label" },
  ],
  concierge: [
    { kind: "text", key: "eyebrow", label: "Eyebrow" },
    { kind: "text", key: "headline", label: "Headline" },
    { kind: "textarea", key: "body", label: "Body", rows: 4 },
    { kind: "textarea", key: "successMessage", label: "Success message", rows: 2 },
    { kind: "text", key: "enquiringAboutLabel", label: "Enquiring about label" },
    { kind: "text", key: "whatsappLinkLabel", label: "WhatsApp link text" },
    { kind: "text", key: "whatsappInsteadLabel", label: "WhatsApp Instead button" },
    { kind: "text", key: "submitLabel", label: "Submit button" },
    { kind: "text", key: "submittingLabel", label: "Submitting button" },
    { kind: "text", key: "fieldName", label: "Name field label" },
    { kind: "text", key: "fieldEmail", label: "Email field label" },
    { kind: "text", key: "fieldPhone", label: "Phone field label" },
    { kind: "text", key: "fieldDates", label: "Dates field label" },
    { kind: "text", key: "fieldMessage", label: "Message field label" },
    { kind: "text", key: "datesPlaceholder", label: "Dates placeholder" },
    { kind: "text", key: "messagePlaceholder", label: "Message placeholder" },
    {
      kind: "text",
      key: "messagePlaceholderWithRoom",
      label: "Message placeholder with room ({room})",
    },
    { kind: "textarea", key: "errorMessage", label: "Error message", rows: 2 },
  ],
  footer: [
    { kind: "text", key: "copyrightSuffix", label: "Copyright text (after year)" },
    {
      kind: "text",
      key: "creditLine",
      label: "Credit line (e.g. Developed by …)",
    },
    { kind: "links", key: "links", label: "Footer links" },
  ],
};

function str(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

export function getSectionDefaults(key: string): Record<string, unknown> {
  return { ...(DEFAULT_SECTIONS[key] ?? {}) };
}

export function SectionForm({
  sectionKey,
  value,
  onChange,
}: {
  sectionKey: string;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const fields = SECTION_FIELDS[sectionKey] ?? [];

  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  if (fields.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No form schema for this section. Contact developer.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {fields.map((field) => {
        if (field.kind === "text") {
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Input
                value={str(value[field.key])}
                onChange={(e) => set(field.key, e.target.value)}
              />
            </div>
          );
        }
        if (field.kind === "textarea") {
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              <Textarea
                rows={field.rows ?? 4}
                value={str(value[field.key])}
                onChange={(e) => set(field.key, e.target.value)}
              />
            </div>
          );
        }
        if (field.kind === "image") {
          return (
            <div key={field.key} className="space-y-3">
              <MediaUploadField
                label={field.label}
                value={str(value[field.key])}
                onChange={(url) => set(field.key, url)}
                accept="image/*"
                altText={field.altKey ? str(value[field.altKey]) : undefined}
                hint={field.hint}
              />
              {field.altKey && (
                <div className="space-y-2">
                  <Label>Alt text</Label>
                  <Input
                    value={str(value[field.altKey])}
                    onChange={(e) => set(field.altKey!, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        }
        if (field.kind === "video") {
          return (
            <MediaUploadField
              key={field.key}
              label={field.label}
              value={str(value[field.key])}
              onChange={(url) => set(field.key, url)}
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              hint={field.hint}
            />
          );
        }
        if (field.kind === "stringList") {
          const list = Array.isArray(value[field.key])
            ? (value[field.key] as string[])
            : [];
          return (
            <div key={field.key} className="space-y-2">
              <Label>{field.label}</Label>
              {field.hint && <p className="text-xs text-zinc-500">{field.hint}</p>}
              <Textarea
                rows={4}
                value={list.join("\n")}
                onChange={(e) =>
                  set(
                    field.key,
                    e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  )
                }
              />
            </div>
          );
        }
        if (field.kind === "links") {
          const links = Array.isArray(value[field.key])
            ? (value[field.key] as { label: string; id: string }[])
            : [];
          return (
            <Repeater
              key={field.key}
              label={field.label}
              items={links}
              onChange={(next) => set(field.key, next)}
              empty={{ label: "", id: "" }}
              render={(item, i, update) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => update({ ...item, label: e.target.value })}
                  />
                  <Input
                    placeholder="Anchor id (e.g. suites)"
                    value={item.id}
                    onChange={(e) => update({ ...item, id: e.target.value })}
                  />
                </div>
              )}
            />
          );
        }
        if (field.kind === "stats") {
          const stats = Array.isArray(value[field.key])
            ? (value[field.key] as { value: string; label: string }[])
            : [];
          return (
            <Repeater
              key={field.key}
              label={field.label}
              items={stats}
              onChange={(next) => set(field.key, next)}
              empty={{ value: "", label: "" }}
              render={(item, _i, update) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Value (e.g. 42)"
                    value={item.value}
                    onChange={(e) => update({ ...item, value: e.target.value })}
                  />
                  <Input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => update({ ...item, label: e.target.value })}
                  />
                </div>
              )}
            />
          );
        }
        if (field.kind === "slides") {
          const slides = Array.isArray(value[field.key])
            ? (value[field.key] as { imageUrl: string; alt: string }[])
            : [];
          return (
            <Repeater
              key={field.key}
              label={field.label}
              items={slides}
              onChange={(next) => set(field.key, next)}
              empty={{ imageUrl: "", alt: "" }}
              render={(item, _i, update) => (
                <div className="space-y-2">
                  <MediaUploadField
                    label="Slide image"
                    value={item.imageUrl}
                    onChange={(url) => update({ ...item, imageUrl: url })}
                    accept="image/*"
                    altText={item.alt}
                  />
                  <Input
                    placeholder="Alt text"
                    value={item.alt}
                    onChange={(e) => update({ ...item, alt: e.target.value })}
                  />
                </div>
              )}
            />
          );
        }
        if (field.kind === "experienceItems") {
          const items = Array.isArray(value[field.key])
            ? (value[field.key] as {
                tag: string;
                title: string;
                desc: string;
                imageUrl: string;
                anchor: string;
              }[])
            : [];
          return (
            <Repeater
              key={field.key}
              label={field.label}
              items={items}
              onChange={(next) => set(field.key, next)}
              empty={{ tag: "", title: "", desc: "", imageUrl: "", anchor: "" }}
              render={(item, _i, update) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Tag"
                    value={item.tag}
                    onChange={(e) => update({ ...item, tag: e.target.value })}
                  />
                  <Input
                    placeholder="Anchor id"
                    value={item.anchor}
                    onChange={(e) => update({ ...item, anchor: e.target.value })}
                  />
                  <Input
                    className="sm:col-span-2"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => update({ ...item, title: e.target.value })}
                  />
                  <Textarea
                    className="sm:col-span-2"
                    rows={2}
                    placeholder="Description"
                    value={item.desc}
                    onChange={(e) => update({ ...item, desc: e.target.value })}
                  />
                  <div className="sm:col-span-2">
                    <MediaUploadField
                      label="Card image"
                      value={item.imageUrl}
                      onChange={(url) => update({ ...item, imageUrl: url })}
                      accept="image/*"
                      altText={item.title}
                    />
                  </div>
                </div>
              )}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

function Repeater<T>({
  label,
  items,
  onChange,
  empty,
  render,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  empty: T;
  render: (item: T, index: number, update: (item: T) => void) => ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 p-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...items, empty])}
        >
          Add
        </Button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-zinc-500">No items yet. Click Add.</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="space-y-2 rounded-md border bg-zinc-50 p-3">
          {render(item, index, (next) => {
            const copy = [...items];
            copy[index] = next;
            onChange(copy);
          })}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
