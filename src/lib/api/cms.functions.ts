import { createServerFn } from "@tanstack/react-start";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "../cms/auth.server";
import { loadAdminStats, loadPublicContent } from "../cms/content";
import { getDb } from "../db";
import {
  enquiries,
  media,
  roomImages,
  roomNumbers,
  rooms,
  sections,
  siteSettings,
} from "../db/schema";
import type { SiteSettings } from "../cms/defaults";

export type { SiteSettings };

export const getPublicContentFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      return await loadPublicContent();
    } catch (err) {
      console.error("Failed to load public content from MySQL, using defaults:", err);
      const { DEFAULT_SETTINGS, DEFAULT_SECTIONS } = await import("../cms/defaults");
      return {
        settings: DEFAULT_SETTINGS,
        nav: DEFAULT_SECTIONS.nav,
        hero: DEFAULT_SECTIONS.hero,
        about: DEFAULT_SECTIONS.about,
        categories: DEFAULT_SECTIONS.categories,
        highlight: DEFAULT_SECTIONS.highlight,
        stay: DEFAULT_SECTIONS.stay,
        suites: DEFAULT_SECTIONS.suites,
        dine: DEFAULT_SECTIONS.dine,
        reside: DEFAULT_SECTIONS.reside,
        wellness: DEFAULT_SECTIONS.wellness,
        experience: DEFAULT_SECTIONS.experience,
        location: DEFAULT_SECTIONS.location,
        concierge: DEFAULT_SECTIONS.concierge,
        footer: DEFAULT_SECTIONS.footer,
        ui: DEFAULT_SECTIONS.ui,
        rooms: [],
      };
    }
  },
);

export const getAdminStatsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    return loadAdminStats();
  },
);

export const getSettingsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const content = await loadPublicContent();
    return content.settings;
  },
);

export const updateSettingsFn = createServerFn({ method: "POST" })
  .validator(z.record(z.string(), z.unknown()))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.settingsKey, "general"))
      .limit(1);

    if (existing[0]) {
      await db
        .update(siteSettings)
        .set({ value: data as Record<string, unknown> })
        .where(eq(siteSettings.settingsKey, "general"));
    } else {
      await db.insert(siteSettings).values({
        settingsKey: "general",
        value: data as Record<string, unknown>,
      });
    }
    return { ok: true };
  });

export const getSectionsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const db = getDb();
    const rows = await db.select().from(sections).orderBy(asc(sections.sectionKey));
    return rows.map((row) => ({
      ...row,
      content:
        typeof row.content === "string"
          ? (JSON.parse(row.content) as Record<string, unknown>)
          : (row.content as Record<string, unknown>),
    }));
  },
);

export const updateSectionFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      sectionKey: z.string().min(1),
      content: z.record(z.string(), z.unknown()),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const existing = await db
      .select()
      .from(sections)
      .where(eq(sections.sectionKey, data.sectionKey))
      .limit(1);

    if (existing[0]) {
      await db
        .update(sections)
        .set({ content: data.content })
        .where(eq(sections.sectionKey, data.sectionKey));
    } else {
      await db.insert(sections).values({
        sectionKey: data.sectionKey,
        content: data.content,
      });
    }
    return { ok: true };
  });

export const getRoomsAdminFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const content = await loadPublicContent();
    return content.rooms;
  },
);

export const getRoomAdminFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const content = await loadPublicContent();
    const room = content.rooms.find((r) => r.id === data.id);
    if (!room) throw new Error("Room not found");
    return room;
  });

const roomInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  tagline: z.string(),
  size: z.string(),
  price: z.string(),
  description: z.string(),
  primaryImageUrl: z.string(),
  sortOrder: z.number().int().optional(),
  gallery: z.array(
    z.object({
      url: z.string(),
      caption: z.string(),
    }),
  ),
  numbers: z.array(z.string()),
});

export const createRoomFn = createServerFn({ method: "POST" })
  .validator(roomInputSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const result = await db.insert(rooms).values({
      name: data.name,
      slug: data.slug,
      tagline: data.tagline,
      size: data.size,
      price: data.price,
      description: data.description,
      primaryImageUrl: data.primaryImageUrl,
      sortOrder: data.sortOrder ?? 0,
    });
    const roomId = Number(result[0].insertId);

    for (let i = 0; i < data.gallery.length; i++) {
      const g = data.gallery[i];
      await db.insert(roomImages).values({
        roomId,
        url: g.url,
        caption: g.caption,
        sortOrder: i,
      });
    }
    for (const number of data.numbers) {
      if (number.trim()) {
        await db.insert(roomNumbers).values({ roomId, number: number.trim() });
      }
    }
    return { id: roomId };
  });

export const updateRoomFn = createServerFn({ method: "POST" })
  .validator(roomInputSchema.extend({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    await db
      .update(rooms)
      .set({
        name: data.name,
        slug: data.slug,
        tagline: data.tagline,
        size: data.size,
        price: data.price,
        description: data.description,
        primaryImageUrl: data.primaryImageUrl,
        sortOrder: data.sortOrder ?? 0,
      })
      .where(eq(rooms.id, data.id));

    await db.delete(roomImages).where(eq(roomImages.roomId, data.id));
    await db.delete(roomNumbers).where(eq(roomNumbers.roomId, data.id));

    for (let i = 0; i < data.gallery.length; i++) {
      const g = data.gallery[i];
      await db.insert(roomImages).values({
        roomId: data.id,
        url: g.url,
        caption: g.caption,
        sortOrder: i,
      });
    }
    for (const number of data.numbers) {
      if (number.trim()) {
        await db
          .insert(roomNumbers)
          .values({ roomId: data.id, number: number.trim() });
      }
    }
    return { ok: true };
  });

export const deleteRoomFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    await db.delete(roomImages).where(eq(roomImages.roomId, data.id));
    await db.delete(roomNumbers).where(eq(roomNumbers.roomId, data.id));
    await db.delete(rooms).where(eq(rooms.id, data.id));
    return { ok: true };
  });

export const listMediaFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const db = getDb();
    return db.select().from(media).orderBy(desc(media.createdAt));
  },
);

export const deleteMediaFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    const rows = await db
      .select()
      .from(media)
      .where(eq(media.id, data.id))
      .limit(1);
    const item = rows[0];
    if (item) {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const filePath = path.join(process.cwd(), "public", item.url.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          /* ignore */
        }
      }
      await db.delete(media).where(eq(media.id, data.id));
    }
    return { ok: true };
  });

export const uploadMediaFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      filename: z.string().min(1),
      mimeType: z.string(),
      base64: z.string().min(1),
      alt: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const fs = await import("node:fs");
    const path = await import("node:path");

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    if (!allowed.includes(data.mimeType)) {
      throw new Error("Unsupported file type. Use JPG, PNG, WebP, GIF, MP4, WebM, or MOV.");
    }

    const isVideo = data.mimeType.startsWith("video/");
    const ext =
      data.mimeType === "image/png"
        ? ".png"
        : data.mimeType === "image/webp"
          ? ".webp"
          : data.mimeType === "image/gif"
            ? ".gif"
            : data.mimeType === "video/mp4"
              ? ".mp4"
              : data.mimeType === "video/webm"
                ? ".webm"
                : data.mimeType === "video/ogg"
                  ? ".ogg"
                  : data.mimeType === "video/quicktime"
                    ? ".mov"
                    : ".jpg";

    const safeBase = data.filename
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 80);
    const filename = `${Date.now()}-${safeBase}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadsDir, { recursive: true });
    const buffer = Buffer.from(data.base64, "base64");
    const maxBytes = isVideo ? 40 * 1024 * 1024 : 8 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      throw new Error(isVideo ? "Video too large (max 40MB)" : "Image too large (max 8MB)");
    }
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    const url = `/uploads/${filename}`;

    const db = getDb();
    const result = await db.insert(media).values({
      filename,
      url,
      alt: data.alt ?? safeBase,
    });

    return { id: Number(result[0].insertId), url, filename, mimeType: data.mimeType };
  });

export const createEnquiryFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(1).max(255),
      email: z.string().email().max(255),
      phone: z.string().max(64).optional(),
      preferredDates: z.string().max(255).optional(),
      message: z.string().max(2000).optional(),
      roomPreference: z.string().max(255).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const db = getDb();
    await db.insert(enquiries).values({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() ?? "",
      preferredDates: data.preferredDates?.trim() ?? "",
      message: data.message?.trim() ?? "",
      roomPreference: data.roomPreference?.trim() ?? "",
      status: "new",
    });
    return { ok: true };
  });

export const listEnquiriesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const db = getDb();
    return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  },
);

export const updateEnquiryStatusFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.number().int().positive(),
      status: z.enum(["new", "read", "archived"]),
    }),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = getDb();
    await db
      .update(enquiries)
      .set({ status: data.status })
      .where(eq(enquiries.id, data.id));
    return { ok: true };
  });

