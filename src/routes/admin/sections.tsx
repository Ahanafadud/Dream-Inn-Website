import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getSectionsFn, updateSectionFn } from "@/lib/api/cms.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  SECTION_LABELS,
  SectionForm,
  getSectionDefaults,
} from "@/components/admin/section-form";
import { DEFAULT_SECTIONS } from "@/lib/cms/defaults";
import { cn } from "@/lib/utils";

type SectionsSearch = { section?: string };

export const Route = createFileRoute("/admin/sections")({
  validateSearch: (search: Record<string, unknown>): SectionsSearch => {
    const section = search.section;
    if (typeof section === "string" && section.length > 0) return { section };
    return {};
  },
  loader: () => getSectionsFn(),
  component: SectionsPage,
});

function SectionsPage() {
  const sections = Route.useLoaderData();
  const { section: sectionParam } = Route.useSearch();
  const router = useRouter();
  const navigate = Route.useNavigate();

  const keys = useMemo(() => {
    const fromDb = sections.map((s) => s.sectionKey);
    const all = Array.from(new Set([...Object.keys(DEFAULT_SECTIONS), ...fromDb]));
    const order = Object.keys(SECTION_LABELS);
    return all.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }, [sections]);

  const initial =
    (sectionParam && keys.includes(sectionParam) && sectionParam) ||
    (keys.includes("hero") ? "hero" : keys[0] ?? "hero");

  const [selected, setSelected] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (sectionParam && keys.includes(sectionParam) && sectionParam !== selected) {
      setSelected(sectionParam);
    }
  }, [sectionParam, keys, selected]);

  useEffect(() => {
    const row = sections.find((s) => s.sectionKey === selected);
    setForm({
      ...getSectionDefaults(selected),
      ...(row?.content ?? {}),
    });
  }, [selected, sections]);

  const selectSection = (key: string) => {
    setSelected(key);
    void navigate({
      search: (prev) => ({ ...prev, section: key }),
      replace: true,
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateSectionFn({
        data: { sectionKey: selected, content: form },
      });
      toast.success(`Saved “${SECTION_LABELS[selected] ?? selected}”`);
      router.invalidate();
    } catch {
      toast.error("Failed to save section");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Page content</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Edit every headline, paragraph, button label, and image on the website.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-2 lg:sticky lg:top-4">
          <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Sections
          </p>
          <nav className="flex max-h-[70vh] flex-col gap-0.5 overflow-y-auto">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => selectSection(k)}
                className={cn(
                  "rounded-md px-3 py-2 text-left text-sm transition-colors",
                  selected === k
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                )}
              >
                {SECTION_LABELS[k] ?? k}
              </button>
            ))}
          </nav>
        </aside>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-2 text-lg font-medium">
            {SECTION_LABELS[selected] ?? selected}
          </h2>
          {selected === "categories" && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-medium">Room category cards</p>
              <p className="mt-1 text-amber-900/80">
                Headlines and button labels are edited here. Room names, photos, prices,
                sizes, taglines, and room numbers are managed under{" "}
                <Link to="/admin/rooms" className="font-medium underline underline-offset-2">
                  Rooms
                </Link>
                .
              </p>
            </div>
          )}
          <SectionForm sectionKey={selected} value={form} onChange={setForm} />
        </div>
      </div>
    </div>
  );
}
