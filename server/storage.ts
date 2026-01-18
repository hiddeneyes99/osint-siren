import { users, requestLogs, protectedNumbers, type User, type UpsertUser, type RequestLog } from "@shared/schema";
import { db } from "./db";
import { eq, sql, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deductCredit(userId: string): Promise<User>;
  logRequest(userId: string, service: string, query: string, status: string, result?: any): Promise<void>;
  getRequestHistory(userId: string): Promise<RequestLog[]>;
  
  // Admin methods
  getAllUsers(): Promise<User[]>;
  updateAllUsersCredits(amount: number): Promise<void>;
  isNumberProtected(number: string): Promise<string | null>;
  addProtectedNumber(number: string, reason?: string): Promise<void>;
  removeProtectedNumber(number: string): Promise<void>;
  getProtectedNumbers(): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async deductCredit(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1` })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async logRequest(userId: string, service: string, query: string, status: string, result?: any): Promise<void> {
    await db.insert(requestLogs).values({
      userId,
      service,
      query,
      status,
      result: result || null,
    });
  }

  async getRequestHistory(userId: string): Promise<RequestLog[]> {
    return await db
      .select()
      .from(requestLogs)
      .where(eq(requestLogs.userId, userId))
      .orderBy(sql`${requestLogs.createdAt} DESC`);
  }

  // Admin Implementation
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateAllUsersCredits(amount: number): Promise<void> {
    await db.update(users).set({ credits: sql`${users.credits} + ${amount}` });
  }

  async isNumberProtected(number: string): Promise<string | null> {
    const [protectedNum] = await db.select().from(protectedNumbers).where(eq(protectedNumbers.number, number));
    return protectedNum ? protectedNum.reason || "BAAP KA RAAZ HAI" : null;
  }

  async addProtectedNumber(number: string, reason?: string): Promise<void> {
    await db.insert(protectedNumbers).values({ number, reason }).onConflictDoNothing();
  }

  async removeProtectedNumber(number: string): Promise<void> {
    await db.delete(protectedNumbers).where(eq(protectedNumbers.number, number));
  }

  async getProtectedNumbers(): Promise<string[]> {
    const results = await db.select({ number: protectedNumbers.number }).from(protectedNumbers);
    return results.map(r => r.number);
  }
}

export const storage = new DatabaseStorage();
