import {
  users,
  clients,
  emailCases,
  vehicles,
  waitlistRequests,
  knowledgeItems,
  dailyStats,
  type User,
  type InsertUser,
  type Client,
  type InsertClient,
  type EmailCase,
  type InsertEmailCase,
  type Vehicle,
  type InsertVehicle,
  type WaitlistRequest,
  type InsertWaitlistRequest,
  type KnowledgeItem,
  type InsertKnowledgeItem,
  type DailyStats,
  type InsertDailyStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined>;

  // Emails
  getEmailCase(id: string): Promise<EmailCase | undefined>;
  getEmailCases(filters?: { status?: string; priority?: string; needsHuman?: boolean }): Promise<EmailCase[]>;
  createEmailCase(emailCase: InsertEmailCase): Promise<EmailCase>;
  updateEmailCase(id: string, data: Partial<InsertEmailCase>): Promise<EmailCase | undefined>;
  deleteEmailCase(id: string): Promise<void>;

  // Vehicles
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getVehicles(filters?: { status?: string }): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, data: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<void>;

  // Waitlist
  getWaitlistRequest(id: string): Promise<WaitlistRequest | undefined>;
  getWaitlistRequests(filters?: { status?: string }): Promise<WaitlistRequest[]>;
  createWaitlistRequest(request: InsertWaitlistRequest): Promise<WaitlistRequest>;
  updateWaitlistRequest(id: string, data: Partial<InsertWaitlistRequest>): Promise<WaitlistRequest | undefined>;
  deleteWaitlistRequest(id: string): Promise<void>;

  // Knowledge Base
  getKnowledgeItem(id: string): Promise<KnowledgeItem | undefined>;
  getKnowledgeItems(category?: string): Promise<KnowledgeItem[]>;
  createKnowledgeItem(item: InsertKnowledgeItem): Promise<KnowledgeItem>;
  updateKnowledgeItem(id: string, data: Partial<InsertKnowledgeItem>): Promise<KnowledgeItem | undefined>;
  deleteKnowledgeItem(id: string): Promise<void>;

  // Statistics
  getDailyStats(startDate?: Date, endDate?: Date): Promise<DailyStats[]>;
  createDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  updateDailyStats(id: string, data: Partial<InsertDailyStats>): Promise<DailyStats | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClients(): Promise<Client[]> {
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined> {
    const [client] = await db.update(clients).set(data).where(eq(clients.id, id)).returning();
    return client || undefined;
  }

  // Emails
  async getEmailCase(id: string): Promise<EmailCase | undefined> {
    const [emailCase] = await db.select().from(emailCases).where(eq(emailCases.id, id));
    return emailCase || undefined;
  }

  async getEmailCases(filters?: { status?: string; priority?: string; needsHuman?: boolean }): Promise<EmailCase[]> {
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(emailCases.status, filters.status as any));
    }
    if (filters?.priority) {
      conditions.push(eq(emailCases.priority, filters.priority as any));
    }
    if (filters?.needsHuman !== undefined) {
      conditions.push(eq(emailCases.needsHuman, filters.needsHuman));
    }

    if (conditions.length > 0) {
      return db.select().from(emailCases).where(and(...conditions)).orderBy(desc(emailCases.receivedAt));
    }
    
    return db.select().from(emailCases).orderBy(desc(emailCases.receivedAt));
  }

  async createEmailCase(insertEmailCase: InsertEmailCase): Promise<EmailCase> {
    const [emailCase] = await db.insert(emailCases).values(insertEmailCase).returning();
    return emailCase;
  }

  async updateEmailCase(id: string, data: Partial<InsertEmailCase>): Promise<EmailCase | undefined> {
    const updateData: any = { ...data };
    if (data.status === "replied") {
      updateData.repliedAt = new Date();
    }
    const [emailCase] = await db.update(emailCases).set(updateData).where(eq(emailCases.id, id)).returning();
    return emailCase || undefined;
  }

  async deleteEmailCase(id: string): Promise<void> {
    await db.delete(emailCases).where(eq(emailCases.id, id));
  }

  // Vehicles
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }

  async getVehicles(filters?: { status?: string }): Promise<Vehicle[]> {
    if (filters?.status) {
      return db.select().from(vehicles).where(eq(vehicles.status, filters.status as any)).orderBy(desc(vehicles.createdAt));
    }
    return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(insertVehicle).returning();
    return vehicle;
  }

  async updateVehicle(id: string, data: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [vehicle] = await db.update(vehicles).set(data).where(eq(vehicles.id, id)).returning();
    return vehicle || undefined;
  }

  async deleteVehicle(id: string): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }

  // Waitlist
  async getWaitlistRequest(id: string): Promise<WaitlistRequest | undefined> {
    const [request] = await db.select().from(waitlistRequests).where(eq(waitlistRequests.id, id));
    return request || undefined;
  }

  async getWaitlistRequests(filters?: { status?: string }): Promise<WaitlistRequest[]> {
    if (filters?.status) {
      return db.select().from(waitlistRequests).where(eq(waitlistRequests.status, filters.status as any)).orderBy(desc(waitlistRequests.createdAt));
    }
    return db.select().from(waitlistRequests).orderBy(desc(waitlistRequests.createdAt));
  }

  async createWaitlistRequest(insertRequest: InsertWaitlistRequest): Promise<WaitlistRequest> {
    const [request] = await db.insert(waitlistRequests).values(insertRequest).returning();
    return request;
  }

  async updateWaitlistRequest(id: string, data: Partial<InsertWaitlistRequest>): Promise<WaitlistRequest | undefined> {
    const updateData: any = { ...data };
    if (data.status === "contacted") {
      updateData.lastContactedAt = new Date();
    }
    const [request] = await db.update(waitlistRequests).set(updateData).where(eq(waitlistRequests.id, id)).returning();
    return request || undefined;
  }

  async deleteWaitlistRequest(id: string): Promise<void> {
    await db.delete(waitlistRequests).where(eq(waitlistRequests.id, id));
  }

  // Knowledge Base
  async getKnowledgeItem(id: string): Promise<KnowledgeItem | undefined> {
    const [item] = await db.select().from(knowledgeItems).where(eq(knowledgeItems.id, id));
    return item || undefined;
  }

  async getKnowledgeItems(category?: string): Promise<KnowledgeItem[]> {
    if (category) {
      return db.select().from(knowledgeItems).where(eq(knowledgeItems.category, category));
    }
    return db.select().from(knowledgeItems);
  }

  async createKnowledgeItem(insertItem: InsertKnowledgeItem): Promise<KnowledgeItem> {
    const [item] = await db.insert(knowledgeItems).values(insertItem).returning();
    return item;
  }

  async updateKnowledgeItem(id: string, data: Partial<InsertKnowledgeItem>): Promise<KnowledgeItem | undefined> {
    const [item] = await db.update(knowledgeItems).set({ ...data, updatedAt: new Date() }).where(eq(knowledgeItems.id, id)).returning();
    return item || undefined;
  }

  async deleteKnowledgeItem(id: string): Promise<void> {
    await db.delete(knowledgeItems).where(eq(knowledgeItems.id, id));
  }

  // Statistics
  async getDailyStats(startDate?: Date, endDate?: Date): Promise<DailyStats[]> {
    return db.select().from(dailyStats).orderBy(desc(dailyStats.date));
  }

  async createDailyStats(insertStats: InsertDailyStats): Promise<DailyStats> {
    const [stats] = await db.insert(dailyStats).values(insertStats).returning();
    return stats;
  }

  async updateDailyStats(id: string, data: Partial<InsertDailyStats>): Promise<DailyStats | undefined> {
    const [stats] = await db.update(dailyStats).set(data).where(eq(dailyStats.id, id)).returning();
    return stats || undefined;
  }
}

export const storage = new DatabaseStorage();
