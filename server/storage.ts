import { users, cakes, reviews, 
  type User, type InsertUser, 
  type Cake, type InsertCake, 
  type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

// Use memory store instead of Postgres session store to avoid connection issues
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Cake methods
  getCakes(): Promise<Cake[]>;
  getCakesByCategory(category: string): Promise<Cake[]>;
  getFeaturedCakes(): Promise<Cake[]>;
  getCake(id: number): Promise<Cake | undefined>;
  createCake(cake: InsertCake): Promise<Cake>;
  updateCake(id: number, cake: Partial<InsertCake>): Promise<Cake | undefined>;
  deleteCake(id: number): Promise<void>;
  
  // Review methods
  getReviews(approvedOnly?: boolean): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<Review | undefined>;
  deleteReview(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Use memory store instead of Postgres to fix connection issues
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Cake methods
  async getCakes(): Promise<Cake[]> {
    return db.select().from(cakes).orderBy(desc(cakes.createdAt));
  }
  
  async getCakesByCategory(category: string): Promise<Cake[]> {
    return db.select().from(cakes).where(eq(cakes.category, category as any)).orderBy(desc(cakes.createdAt));
  }
  
  async getFeaturedCakes(): Promise<Cake[]> {
    return db.select().from(cakes).where(eq(cakes.featured, true)).orderBy(desc(cakes.createdAt));
  }
  
  async getCake(id: number): Promise<Cake | undefined> {
    const [cake] = await db.select().from(cakes).where(eq(cakes.id, id));
    return cake;
  }
  
  async createCake(cake: InsertCake): Promise<Cake> {
    const [newCake] = await db.insert(cakes).values(cake).returning();
    return newCake;
  }
  
  async updateCake(id: number, cake: Partial<InsertCake>): Promise<Cake | undefined> {
    const [updatedCake] = await db
      .update(cakes)
      .set({...cake, updatedAt: new Date()})
      .where(eq(cakes.id, id))
      .returning();
    return updatedCake;
  }
  
  async deleteCake(id: number): Promise<void> {
    await db.delete(cakes).where(eq(cakes.id, id));
  }
  
  // Review methods
  async getReviews(approvedOnly = false): Promise<Review[]> {
    if (approvedOnly) {
      return db.select().from(reviews).where(eq(reviews.approved, true)).orderBy(desc(reviews.createdAt));
    }
    return db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }
  
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
  
  async approveReview(id: number): Promise<Review | undefined> {
    const [updatedReview] = await db
      .update(reviews)
      .set({ approved: true })
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }
  
  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
}

export const storage = new DatabaseStorage();
