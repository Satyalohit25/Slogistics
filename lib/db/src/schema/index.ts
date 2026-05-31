// Export your models here. Add one export per file
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * User accounts for the platform
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

/**
 * Shipment data used for dashboard charts and lists
 */
export const shipments = sqliteTable("shipments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  trackingNumber: text("tracking_number").notNull().unique(),
  status: text("status", { enum: ["pending", "in-transit", "delivered", "delayed"] })
    .notNull()
    .default("pending"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  weight: real("weight"),
  estimatedDelivery: integer("estimated_delivery", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  userId: integer("user_id").references(() => users.id),
});

/**
 * Infrastructure data (Ports, Airports, Hubs)
 */
export const infrastructure = sqliteTable("infrastructure", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type", { enum: ["port", "airport", "expressway", "freight-hub", "manufacturing-hub"] }).notNull(),
  rank: integer("rank"),
  state: text("state"),
  city: text("city"),
  cargoMT: real("cargo_mt"),
  status: text("status"),
  aiEnabled: integer("ai_enabled", { mode: "boolean" }).default(false),
});

/**
 * Transport Mode modal split
 */
export const transportModes = sqliteTable("transport_modes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  mode: text("mode").notNull(),
  sharePercent: real("share_percent").notNull(),
  volumeMT: real("volume_mt"),
  growthRate: real("growth_rate"),
  color: text("color"),
});

/**
 * State-wise Policy and Adoption Metrics
 */
export const stateAdoption = sqliteTable("state_adoption", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  state: text("state").notNull().unique(),
  lpi: real("lpi").notNull(),
  policyScore: real("policy_score"),
  infrastructureScore: real("infrastructure_score"),
  aiAdoption: real("ai_adoption"),
  warehouseCapacity: real("warehouse_capacity"),
  rank: integer("rank"),
});

export type User = typeof users.$inferSelect;
export type Shipment = typeof shipments.$inferSelect;