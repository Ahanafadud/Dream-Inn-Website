import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/mysql-core";

export const admins = mysqlTable("admins", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().autoincrement(),
  settingsKey: varchar("settings_key", { length: 64 }).notNull().unique(),
  value: json("value").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const sections = mysqlTable("sections", {
  id: int("id").primaryKey().autoincrement(),
  sectionKey: varchar("section_key", { length: 64 }).notNull().unique(),
  content: json("content").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const rooms = mysqlTable(
  "rooms",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    tagline: varchar("tagline", { length: 255 }).notNull().default(""),
    size: varchar("size", { length: 64 }).notNull().default(""),
    price: varchar("price", { length: 128 }).notNull().default(""),
    description: text("description").notNull(),
    primaryImageUrl: varchar("primary_image_url", { length: 512 }).notNull().default(""),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("rooms_sort_idx").on(t.sortOrder)],
);

export const roomImages = mysqlTable(
  "room_images",
  {
    id: int("id").primaryKey().autoincrement(),
    roomId: int("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    url: varchar("url", { length: 512 }).notNull(),
    caption: varchar("caption", { length: 255 }).notNull().default(""),
    sortOrder: int("sort_order").notNull().default(0),
  },
  (t) => [index("room_images_room_idx").on(t.roomId)],
);

export const roomNumbers = mysqlTable(
  "room_numbers",
  {
    id: int("id").primaryKey().autoincrement(),
    roomId: int("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    number: varchar("number", { length: 32 }).notNull(),
  },
  (t) => [index("room_numbers_room_idx").on(t.roomId)],
);

export const media = mysqlTable("media", {
  id: int("id").primaryKey().autoincrement(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  alt: varchar("alt", { length: 255 }).notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const enquiries = mysqlTable(
  "enquiries",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 64 }).notNull().default(""),
    preferredDates: varchar("preferred_dates", { length: 255 }).notNull().default(""),
    message: text("message").notNull(),
    roomPreference: varchar("room_preference", { length: 255 }).notNull().default(""),
    status: mysqlEnum("status", ["new", "read", "archived"]).notNull().default("new"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("enquiries_status_idx").on(t.status)],
);

export type Admin = typeof admins.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type RoomImage = typeof roomImages.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type MediaItem = typeof media.$inferSelect;
