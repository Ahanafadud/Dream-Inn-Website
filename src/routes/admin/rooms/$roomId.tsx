import { createFileRoute } from "@tanstack/react-router";
import { RoomEditor } from "@/components/admin/room-editor";
import { getRoomAdminFn, updateRoomFn } from "@/lib/api/cms.functions";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/rooms/$roomId")({
  loader: ({ params }) => getRoomAdminFn({ data: { id: Number(params.roomId) } }),
  component: EditRoomPage,
});

function EditRoomPage() {
  const room = Route.useLoaderData();
  const router = useRouter();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit room</h1>
      <p className="mt-1 text-sm text-zinc-500">{room.name}</p>
      <div className="mt-8">
        <RoomEditor
          initial={{
            name: room.name,
            slug: room.slug,
            tagline: room.tagline,
            size: room.size,
            price: room.price,
            description: room.description,
            primaryImageUrl: room.image,
            sortOrder: 0,
            gallery: room.gallery.map((g) => ({ url: g.src, caption: g.caption })),
            numbers: room.numbers,
          }}
          onSave={async (data) => {
            try {
              await updateRoomFn({ data: { ...data, id: room.id } });
              toast.success("Room saved");
              router.invalidate();
            } catch {
              toast.error("Failed to save room");
            }
          }}
        />
      </div>
    </div>
  );
}
