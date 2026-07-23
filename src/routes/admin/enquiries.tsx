import { createFileRoute, useRouter } from "@tanstack/react-router";
import { listEnquiriesFn, updateEnquiryStatusFn } from "@/lib/api/cms.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/enquiries")({
  loader: () => listEnquiriesFn(),
  component: EnquiriesPage,
});

function EnquiriesPage() {
  const items = Route.useLoaderData();
  const router = useRouter();

  const setStatus = async (id: number, status: "new" | "read" | "archived") => {
    try {
      await updateEnquiryStatusFn({ data: { id, status } });
      toast.success(`Marked as ${status}`);
      router.invalidate();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Enquiries</h1>
      <p className="mt-1 text-sm text-zinc-500">Concierge form submissions from the website.</p>

      <div className="mt-8 space-y-4">
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
            No enquiries yet.
          </p>
        )}
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{item.name}</h2>
                  <Badge variant={item.status === "new" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {item.email}
                  {item.phone ? ` · ${item.phone}` : ""}
                </p>
                {item.roomPreference && (
                  <p className="mt-1 text-sm text-zinc-600">
                    Interested in: <span className="font-medium">{item.roomPreference}</span>
                  </p>
                )}
                {item.preferredDates && (
                  <p className="text-sm text-zinc-600">Dates: {item.preferredDates}</p>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
            {item.message && (
              <p className="mt-4 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
                {item.message}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {item.status !== "read" && (
                <Button size="sm" variant="outline" onClick={() => setStatus(item.id, "read")}>
                  Mark read
                </Button>
              )}
              {item.status !== "archived" && (
                <Button size="sm" variant="outline" onClick={() => setStatus(item.id, "archived")}>
                  Archive
                </Button>
              )}
              {item.status !== "new" && (
                <Button size="sm" variant="ghost" onClick={() => setStatus(item.id, "new")}>
                  Mark new
                </Button>
              )}
              <Button size="sm" variant="ghost" asChild>
                <a href={`mailto:${item.email}`}>Reply by email</a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
