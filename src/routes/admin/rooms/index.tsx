import { createFileRoute, Link } from "@tanstack/react-router";
import { getRoomsAdminFn, deleteRoomFn } from "@/lib/api/cms.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/rooms/")({
  loader: () => getRoomsAdminFn(),
  component: RoomsListPage,
});

function RoomsListPage() {
  const rooms = Route.useLoaderData();
  const router = useRouter();

  const remove = async (id: number, name: string) => {
    if (!confirm(`Delete “${name}”? This cannot be undone.`)) return;
    try {
      await deleteRoomFn({ data: { id } });
      toast.success("Room deleted");
      router.invalidate();
    } catch {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Rooms</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage suites, prices, galleries, and room numbers. These cards appear in the{" "}
            <Link
              to="/admin/sections"
              search={{ section: "categories" }}
              className="underline underline-offset-2"
            >
              Room categories
            </Link>{" "}
            and Suites sections on the website.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/rooms/new">Add room</Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Room</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {r.image ? (
                      <img src={r.image} alt="" className="h-12 w-16 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-16 rounded bg-zinc-100" />
                    )}
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-zinc-500">{r.tagline}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{r.size}</td>
                <td className="px-4 py-3 text-zinc-600">{r.price}</td>
                <td className="px-4 py-3 text-zinc-600">{r.numbers.length}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin/rooms/$roomId" params={{ roomId: String(r.id) }}>
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(r.id, r.name)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
