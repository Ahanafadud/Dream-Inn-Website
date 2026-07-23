import "dotenv/config";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDb } from "../src/lib/db/index.ts";
import {
  admins,
  enquiries,
  media,
  roomImages,
  roomNumbers,
  rooms,
  sections,
  siteSettings,
} from "../src/lib/db/schema.ts";
import {
  DEFAULT_SECTIONS,
  DEFAULT_SETTINGS,
  SEED_MEDIA_FILES,
  SEED_ROOMS,
} from "../src/lib/cms/defaults.ts";
import { getServerConfig } from "../src/lib/config.server.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const assetsDir = path.join(root, "src", "assets");
const uploadsDir = path.join(root, "public", "uploads");

async function copyAssets() {
  fs.mkdirSync(uploadsDir, { recursive: true });
  for (const file of SEED_MEDIA_FILES) {
    const src = path.join(assetsDir, file);
    const dest = path.join(uploadsDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file}`);
    } else {
      console.warn(`Missing asset: ${file}`);
    }
  }
}

async function seed() {
  await copyAssets();
  const db = getDb();
  const config = getServerConfig();

  // Clear existing CMS data (safe for re-seed)
  await db.delete(enquiries);
  await db.delete(roomImages);
  await db.delete(roomNumbers);
  await db.delete(rooms);
  await db.delete(media);
  await db.delete(sections);
  await db.delete(siteSettings);

  await db.insert(siteSettings).values({
    settingsKey: "general",
    value: DEFAULT_SETTINGS as unknown as Record<string, unknown>,
  });

  for (const [sectionKey, content] of Object.entries(DEFAULT_SECTIONS)) {
    await db.insert(sections).values({
      sectionKey,
      content: content as Record<string, unknown>,
    });
  }

  for (const file of SEED_MEDIA_FILES) {
    await db.insert(media).values({
      filename: file,
      url: `/uploads/${file}`,
      alt: file.replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/-/g, " "),
    });
  }

  let order = 0;
  for (const room of SEED_ROOMS) {
    const result = await db.insert(rooms).values({
      name: room.name,
      slug: room.slug,
      tagline: room.tagline,
      size: room.size,
      price: room.price,
      description: room.description,
      primaryImageUrl: `/uploads/${room.primaryImage}`,
      sortOrder: order++,
    });
    const roomId = Number(result[0].insertId);

    for (let i = 0; i < room.gallery.length; i++) {
      const g = room.gallery[i];
      await db.insert(roomImages).values({
        roomId,
        url: `/uploads/${g.file}`,
        caption: g.caption,
        sortOrder: i,
      });
    }

    for (const number of room.numbers) {
      await db.insert(roomNumbers).values({ roomId, number });
    }
  }

  const existingAdmin = await db
    .select()
    .from(admins)
    .where(eq(admins.email, config.adminEmail))
    .limit(1);

  if (existingAdmin.length === 0) {
    const passwordHash = await hash(config.adminPassword, 12);
    await db.insert(admins).values({
      email: config.adminEmail,
      passwordHash,
    });
    console.log(`Admin created: ${config.adminEmail}`);
  } else {
    console.log(`Admin already exists: ${config.adminEmail}`);
  }

  console.log("Seed completed successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
