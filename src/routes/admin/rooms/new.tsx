import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RoomEditor } from "@/components/admin/room-editor";
import { createRoomFn } from "@/lib/api/cms.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/rooms/new")({
  component: NewRoomPage,
});

function NewRoomPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Add room</h1>
      <p className="mt-1 text-sm text-zinc-500">Create a new suite or room category.</p>
      <div className="mt-8">
        <RoomEditor
          initial={{
            name: "",
            slug: "",
            tagline: "",
            size: "",
            price: "",
            description: "",
            primaryImageUrl: "",
            sortOrder: 0,
            gallery: [],
            numbers: [],
          }}
          onSave={async (data) => {
            try {
              const result = await createRoomFn({ data });
              toast.success("Room created");
              navigate({
                to: "/admin/rooms/$roomId",
                params: { roomId: String(result.id) },
              });
            } catch {
              toast.error("Failed to create room");
            }
          }}
        />
      </div>
    </div>
  );
}
