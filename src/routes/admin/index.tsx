import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { getAdminStatsFn } from "@/lib/api/cms.functions";
import { BedDouble, Image, Inbox, Layers } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  loader: () => getAdminStatsFn(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = Route.useLoaderData();

  const cards = [
    { label: "Rooms", value: stats.rooms, href: "/admin/rooms", icon: BedDouble },
    { label: "Media files", value: stats.media, href: "/admin/media", icon: Image },
    { label: "New enquiries", value: stats.enquiriesNew, href: "/admin/enquiries", icon: Inbox },
    { label: "Total enquiries", value: stats.enquiriesTotal, href: "/admin/enquiries", icon: Layers },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Edit any website text, image, room, or contact detail. Changes appear on the live site after refresh.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.href}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">{c.label}</p>
                <Icon className="h-4 w-4 text-zinc-400" />
              </div>
              <p className="mt-3 text-3xl font-semibold tabular-nums">{c.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-sm font-medium">Quick edits</p>
        <p className="mt-1 text-sm text-zinc-500">
          Jump straight to the sections guests see most.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink to="/admin/sections" search={{ section: "categories" }}>
            Room categories
          </ButtonLink>
          <ButtonLink to="/admin/rooms">Room cards &amp; prices</ButtonLink>
          <ButtonLink to="/admin/sections" search={{ section: "hero" }}>
            Hero
          </ButtonLink>
          <ButtonLink to="/admin/sections" search={{ section: "concierge" }}>
            Concierge
          </ButtonLink>
          <ButtonLink to="/admin/settings">Brand &amp; logo</ButtonLink>
        </div>
      </div>
    </div>
  );
}

function ButtonLink({
  to,
  search,
  children,
}: {
  to: string;
  search?: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      search={search}
      className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-800 transition hover:border-zinc-300 hover:bg-white"
    >
      {children}
    </Link>
  );
}
