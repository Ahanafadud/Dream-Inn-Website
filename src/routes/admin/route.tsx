import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Settings, Layers, BedDouble, Image, Inbox, LogOut, ExternalLink } from "lucide-react";
import { meFn, logoutFn } from "@/lib/api/auth.functions";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/login") return {};
    const admin = await meFn();
    if (!admin) {
      throw redirect({ to: "/admin/login" });
    }
    return { admin };
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/sections", label: "Page content", icon: Layers },
  { to: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";
  const navigate = useNavigate();

  if (isLogin) {
    return (
      <div className="admin-theme min-h-svh">
        <Outlet />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="admin-theme flex h-svh overflow-hidden text-zinc-900">
      <aside className="sticky top-0 flex h-svh w-60 shrink-0 flex-col border-r border-zinc-200 bg-zinc-950 text-zinc-100">
        <div className="shrink-0 border-b border-zinc-800 px-5 py-5">
          <p className="text-xs uppercase tracking-widest text-zinc-500">CMS</p>
          <p className="mt-1 font-semibold tracking-tight text-white">RRP Dream Inn</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto shrink-0 space-y-1 border-t border-zinc-800 bg-zinc-950 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </a>
          <button
            type="button"
            className="flex w-full items-center justify-start gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
            onClick={async () => {
              await logoutFn();
              navigate({ to: "/admin/login" });
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-h-0 flex-1 overflow-y-auto bg-zinc-100">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
