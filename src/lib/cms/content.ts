import { asc, eq } from "drizzle-orm";
import { getDb } from "../db";
import {
  media,
  roomImages,
  roomNumbers,
  rooms,
  sections,
  siteSettings,
} from "../db/schema";
import {
  DEFAULT_SECTIONS,
  DEFAULT_SETTINGS,
  type AboutContent,
  type CategoriesContent,
  type ConciergeContent,
  type DineContent,
  type ExperienceContent,
  type FooterContent,
  type HeroContent,
  type HighlightContent,
  type LocationContent,
  type NavContent,
  type PublicContent,
  type ResideContent,
  type RoomPublic,
  type SiteSettings,
  type StayContent,
  type SuitesContent,
  type WellnessContent,
  type UiContent,
} from "./defaults";

function parseJson<T extends Record<string, unknown>>(value: unknown): T {
  if (value == null) return {} as T;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return {} as T;
    }
  }
  if (typeof value === "object") return value as T;
  return {} as T;
}

function asSection<T extends Record<string, unknown>>(
  key: string,
  map: Map<string, Record<string, unknown>>,
): T {
  const defaults = (DEFAULT_SECTIONS[key] ?? {}) as T;
  const fromDb = map.get(key);
  if (!fromDb || Object.keys(fromDb).length === 0) return defaults;
  return { ...defaults, ...fromDb } as T;
}

export async function loadPublicContent(): Promise<PublicContent> {
  const db = getDb();

  const [settingsRows, sectionRows, roomRows] = await Promise.all([
    db.select().from(siteSettings).where(eq(siteSettings.settingsKey, "general")).limit(1),
    db.select().from(sections),
    db.select().from(rooms).orderBy(asc(rooms.sortOrder)),
  ]);

  const settings = {
    ...DEFAULT_SETTINGS,
    ...parseJson<Partial<SiteSettings>>(settingsRows[0]?.value),
  };

  const sectionMap = new Map(
    sectionRows.map((s) => [s.sectionKey, parseJson<Record<string, unknown>>(s.content)]),
  );

  const roomIds = roomRows.map((r) => r.id);
  const images =
    roomIds.length > 0
      ? await db.select().from(roomImages).orderBy(asc(roomImages.sortOrder))
      : [];
  const numbers =
    roomIds.length > 0 ? await db.select().from(roomNumbers) : [];

  const publicRooms: RoomPublic[] = roomRows.map((r) => {
    const gallery = images
      .filter((img) => img.roomId === r.id)
      .map((img) => ({ src: img.url, caption: img.caption }));
    const nums = numbers.filter((n) => n.roomId === r.id).map((n) => n.number);
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      tagline: r.tagline,
      size: r.size,
      price: r.price,
      description: r.description,
      image: r.primaryImageUrl,
      gallery: gallery.length
        ? gallery
        : r.primaryImageUrl
          ? [{ src: r.primaryImageUrl, caption: r.name }]
          : [],
      numbers: nums,
    };
  });

  return {
    settings,
    nav: asSection<NavContent>("nav", sectionMap),
    hero: asSection<HeroContent>("hero", sectionMap),
    about: asSection<AboutContent>("about", sectionMap),
    categories: asSection<CategoriesContent>("categories", sectionMap),
    highlight: asSection<HighlightContent>("highlight", sectionMap),
    stay: asSection<StayContent>("stay", sectionMap),
    suites: asSection<SuitesContent>("suites", sectionMap),
    dine: asSection<DineContent>("dine", sectionMap),
    reside: asSection<ResideContent>("reside", sectionMap),
    wellness: asSection<WellnessContent>("wellness", sectionMap),
    experience: asSection<ExperienceContent>("experience", sectionMap),
    location: asSection<LocationContent>("location", sectionMap),
    concierge: asSection<ConciergeContent>("concierge", sectionMap),
    footer: asSection<FooterContent>("footer", sectionMap),
    ui: asSection<UiContent>("ui", sectionMap),
    rooms: publicRooms,
  };
}

export async function loadAdminStats() {
  const db = getDb();
  const { enquiries } = await import("../db/schema");
  const [allRooms, allMedia, allEnquiries] = await Promise.all([
    db.select().from(rooms),
    db.select().from(media),
    db.select().from(enquiries),
  ]);
  return {
    rooms: allRooms.length,
    media: allMedia.length,
    enquiriesNew: allEnquiries.filter((e) => e.status === "new").length,
    enquiriesTotal: allEnquiries.length,
  };
}
