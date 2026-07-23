import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { getServerConfig } from "../config.server";

type DbGlobal = {
  pool?: mysql.Pool;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

const g = globalThis as typeof globalThis & { __dreaminnDb?: DbGlobal };

function getGlobalStore(): DbGlobal {
  if (!g.__dreaminnDb) g.__dreaminnDb = {};
  return g.__dreaminnDb;
}

export function getPool() {
  const store = getGlobalStore();
  if (!store.pool) {
    const { db } = getServerConfig();
    store.pool = mysql.createPool({
      host: db.host,
      port: db.port,
      user: db.user,
      password: db.password,
      database: db.database,
      // Keep low for local XAMPP; one shared pool across Vite HMR reloads.
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,
      maxIdle: 5,
      idleTimeout: 60_000,
    });
  }
  return store.pool;
}

export function getDb() {
  const store = getGlobalStore();
  if (!store.db) {
    store.db = drizzle(getPool(), { schema, mode: "default" });
  }
  return store.db;
}

export type Db = ReturnType<typeof getDb>;
