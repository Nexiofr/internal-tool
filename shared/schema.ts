import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "seller", "readonly"]);
export const emailStatusEnum = pgEnum("email_status", ["new", "in_progress", "replied", "follow_up"]);
export const emailPriorityEnum = pgEnum("email_priority", ["low", "medium", "high"]);
export const waitlistStatusEnum = pgEnum("waitlist_status", ["waiting", "contacted", "converted", "inactive"]);
export const vehicleStatusEnum = pgEnum("vehicle_status", ["available", "reserved", "sold"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["gasoline", "diesel", "hybrid", "electric"]);
export const transmissionEnum = pgEnum("transmission", ["manual", "automatic"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  role: userRoleEnum("role").notNull().default("seller"),
});

// Clients table
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  smsConsent: boolean("sms_consent").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email Cases table
export const emailCases = pgTable("email_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  senderEmail: text("sender_email").notNull(),
  senderName: text("sender_name"),
  attachments: text("attachments").array(),
  status: emailStatusEnum("status").notNull().default("new"),
  priority: emailPriorityEnum("priority").notNull().default("medium"),
  aiReason: text("ai_reason"),
  needsHuman: boolean("needs_human").default(true),
  assignedTo: varchar("assigned_to").references(() => users.id),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id),
  internalNotes: text("internal_notes"),
  draftResponse: text("draft_response"),
  receivedAt: timestamp("received_at").defaultNow(),
  repliedAt: timestamp("replied_at"),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reference: text("reference").notNull().unique(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  fuel: fuelTypeEnum("fuel").notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  mileage: integer("mileage").notNull(),
  price: integer("price").notNull(),
  color: text("color"),
  status: vehicleStatusEnum("status").notNull().default("available"),
  aiUsable: boolean("ai_usable").default(true),
  description: text("description"),
  photos: text("photos").array(),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Waitlist Requests table
export const waitlistRequests = pgTable("waitlist_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id),
  clientName: text("client_name").notNull(),
  phone: text("phone").notNull(),
  smsConsent: boolean("sms_consent").default(false),
  status: waitlistStatusEnum("status").notNull().default("waiting"),
  priority: emailPriorityEnum("priority").notNull().default("medium"),
  brandPreference: text("brand_preference"),
  modelPreference: text("model_preference"),
  yearMin: integer("year_min"),
  yearMax: integer("year_max"),
  fuelPreference: fuelTypeEnum("fuel_preference"),
  transmissionPreference: transmissionEnum("transmission_preference"),
  maxMileage: integer("max_mileage"),
  maxBudget: integer("max_budget"),
  colorPreference: text("color_preference"),
  notes: text("notes"),
  contactHistory: text("contact_history"),
  createdAt: timestamp("created_at").defaultNow(),
  lastContactedAt: timestamp("last_contacted_at"),
});

// Knowledge Base Items table
export const knowledgeItems = pgTable("knowledge_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by").references(() => users.id),
});

// Statistics/Analytics (aggregated data)
export const dailyStats = pgTable("daily_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  totalEmails: integer("total_emails").default(0),
  aiResponses: integer("ai_responses").default(0),
  humanEscalations: integer("human_escalations").default(0),
  avgResponseTimeMinutes: integer("avg_response_time_minutes"),
  totalCalls: integer("total_calls").default(0),
  aiHandledCalls: integer("ai_handled_calls").default(0),
  transferredCalls: integer("transferred_calls").default(0),
  avgCallDurationSeconds: integer("avg_call_duration_seconds"),
  waitlistConversions: integer("waitlist_conversions").default(0),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assignedEmails: many(emailCases),
  knowledgeUpdates: many(knowledgeItems),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  emails: many(emailCases),
  waitlistRequests: many(waitlistRequests),
}));

export const emailCasesRelations = relations(emailCases, ({ one }) => ({
  client: one(clients, {
    fields: [emailCases.clientId],
    references: [clients.id],
  }),
  assignee: one(users, {
    fields: [emailCases.assignedTo],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [emailCases.vehicleId],
    references: [vehicles.id],
  }),
}));

export const waitlistRequestsRelations = relations(waitlistRequests, ({ one }) => ({
  client: one(clients, {
    fields: [waitlistRequests.clientId],
    references: [clients.id],
  }),
}));

export const knowledgeItemsRelations = relations(knowledgeItems, ({ one }) => ({
  updater: one(users, {
    fields: [knowledgeItems.updatedBy],
    references: [users.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertEmailCaseSchema = createInsertSchema(emailCases).omit({ id: true, receivedAt: true, repliedAt: true });
export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true, createdAt: true });
export const insertWaitlistRequestSchema = createInsertSchema(waitlistRequests).omit({ id: true, createdAt: true, lastContactedAt: true });
export const insertKnowledgeItemSchema = createInsertSchema(knowledgeItems).omit({ id: true, updatedAt: true });
export const insertDailyStatsSchema = createInsertSchema(dailyStats).omit({ id: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertEmailCase = z.infer<typeof insertEmailCaseSchema>;
export type EmailCase = typeof emailCases.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertWaitlistRequest = z.infer<typeof insertWaitlistRequestSchema>;
export type WaitlistRequest = typeof waitlistRequests.$inferSelect;
export type InsertKnowledgeItem = z.infer<typeof insertKnowledgeItemSchema>;
export type KnowledgeItem = typeof knowledgeItems.$inferSelect;
export type InsertDailyStats = z.infer<typeof insertDailyStatsSchema>;
export type DailyStats = typeof dailyStats.$inferSelect;

// Enums for frontend
export const EMAIL_STATUS_OPTIONS = ["new", "in_progress", "replied", "follow_up"] as const;
export const EMAIL_PRIORITY_OPTIONS = ["low", "medium", "high"] as const;
export const WAITLIST_STATUS_OPTIONS = ["waiting", "contacted", "converted", "inactive"] as const;
export const VEHICLE_STATUS_OPTIONS = ["available", "reserved", "sold"] as const;
export const FUEL_TYPE_OPTIONS = ["gasoline", "diesel", "hybrid", "electric"] as const;
export const TRANSMISSION_OPTIONS = ["manual", "automatic"] as const;
export const USER_ROLE_OPTIONS = ["admin", "seller", "readonly"] as const;
