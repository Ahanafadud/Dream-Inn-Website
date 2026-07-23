import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="luxe-eyebrow">Page Not Found</p>
        <h1 className="mt-6 font-serif text-7xl text-foreground">404</h1>
        <div className="mx-auto mt-6 gold-divider" />
        <p className="mt-6 text-sm text-muted-foreground">
          The page you seek has retreated into the quiet.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-gold px-8 py-3 text-xs tracking-luxe uppercase text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="luxe-eyebrow">An Interruption</p>
        <h1 className="mt-6 font-serif text-3xl text-foreground">This page didn't load</h1>
        <div className="mx-auto mt-6 gold-divider" />
        <p className="mt-6 text-sm text-muted-foreground">
          Please refresh, or return to the lobby.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border border-gold bg-gold px-8 py-3 text-xs tracking-luxe uppercase text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
          <a
            href="/"
            className="border border-border px-8 py-3 text-xs tracking-luxe uppercase text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RRP Dream Inn — Luxury Hotel in Ishwardi, Pabna" },
      { name: "description", content: "RRP Dream Inn is an ultra-luxury hotel in Ishwardi, Pabna — Italian-inspired suites, refined dining, and quiet hospitality on the Padma." },
      { name: "author", content: "RRP Dream Inn" },
      { property: "og:title", content: "RRP Dream Inn — Luxury Hotel in Ishwardi" },
      { property: "og:description", content: "An ultra-luxury retreat in Ishwardi, Pabna. Italian-inspired interiors, signature suites, and quiet hospitality." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
