import { users, cakes, reviews, galleryImages, recipes, specialOffers, blogPosts, siteSettings, contactMessages,
  type User, type InsertUser, 
  type Cake, type InsertCake, 
  type Review, type InsertReview,
  type GalleryImage, type InsertGalleryImage,
  type Recipe, type InsertRecipe,
  type SpecialOffer, type InsertSpecialOffer,
  type BlogPost, type InsertBlogPost,
  type SiteSetting, type InsertSiteSetting,
  type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike } from "drizzle-orm";
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
  
  // Gallery methods
  getGalleryImages(): Promise<GalleryImage[]>;
  getFeaturedGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<void>;
  
  // Recipe methods
  getRecipes(): Promise<Recipe[]>;
  getFeaturedRecipes(): Promise<Recipe[]>;
  getRecipesByCategory(category: string): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<void>;
  
  // Special Offer methods
  getSpecialOffers(activeOnly?: boolean): Promise<SpecialOffer[]>;
  getSpecialOffer(id: number): Promise<SpecialOffer | undefined>;
  createSpecialOffer(offer: InsertSpecialOffer): Promise<SpecialOffer>;
  updateSpecialOffer(id: number, offer: Partial<InsertSpecialOffer>): Promise<SpecialOffer | undefined>;
  deleteSpecialOffer(id: number): Promise<void>;
  
  // Blog Post methods
  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Site Settings methods
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSettingsByCategory(category: string): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  createOrUpdateSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
  
  // Contact Message methods
  getContactMessages(): Promise<ContactMessage[]>;
  getUnreadContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<void>;
  
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
    const [newCake] = await db.insert(cakes).values(cake as any).returning();
    return newCake;
  }
  
  async updateCake(id: number, cake: Partial<InsertCake>): Promise<Cake | undefined> {
    const [updatedCake] = await db
      .update(cakes)
      .set({...(cake as any), updatedAt: new Date()})
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

  // Gallery methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    return db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
  }
  
  async getFeaturedGalleryImages(): Promise<GalleryImage[]> {
    return db.select().from(galleryImages).where(eq(galleryImages.featured, true)).orderBy(desc(galleryImages.createdAt));
  }
  
  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    const [image] = await db.select().from(galleryImages).where(eq(galleryImages.id, id));
    return image;
  }
  
  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [newImage] = await db.insert(galleryImages).values(image).returning();
    return newImage;
  }
  
  async updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const [updatedImage] = await db
      .update(galleryImages)
      .set(image)
      .where(eq(galleryImages.id, id))
      .returning();
    return updatedImage;
  }
  
  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }
  
  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return db.select().from(recipes).orderBy(desc(recipes.createdAt));
  }
  
  async getFeaturedRecipes(): Promise<Recipe[]> {
    return db.select().from(recipes).where(eq(recipes.featured, true)).orderBy(desc(recipes.createdAt));
  }
  
  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    return db.select().from(recipes).where(eq(recipes.category, category as any)).orderBy(desc(recipes.createdAt));
  }
  
  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }
  
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db.insert(recipes).values(recipe as any).returning();
    return newRecipe;
  }
  
  async updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const [updatedRecipe] = await db
      .update(recipes)
      .set({...(recipe as any), updatedAt: new Date()})
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe;
  }
  
  async deleteRecipe(id: number): Promise<void> {
    await db.delete(recipes).where(eq(recipes.id, id));
  }
  
  // Special Offer methods
  async getSpecialOffers(activeOnly = true): Promise<SpecialOffer[]> {
    if (activeOnly) {
      return db.select().from(specialOffers).where(eq(specialOffers.active, true)).orderBy(desc(specialOffers.createdAt));
    }
    return db.select().from(specialOffers).orderBy(desc(specialOffers.createdAt));
  }
  
  async getSpecialOffer(id: number): Promise<SpecialOffer | undefined> {
    const [offer] = await db.select().from(specialOffers).where(eq(specialOffers.id, id));
    return offer;
  }
  
  async createSpecialOffer(offer: InsertSpecialOffer): Promise<SpecialOffer> {
    const [newOffer] = await db.insert(specialOffers).values(offer as any).returning();
    return newOffer;
  }
  
  async updateSpecialOffer(id: number, offer: Partial<InsertSpecialOffer>): Promise<SpecialOffer | undefined> {
    const [updatedOffer] = await db
      .update(specialOffers)
      .set({...(offer as any), updatedAt: new Date()})
      .where(eq(specialOffers.id, id))
      .returning();
    return updatedOffer;
  }
  
  async deleteSpecialOffer(id: number): Promise<void> {
    await db.delete(specialOffers).where(eq(specialOffers.id, id));
  }
  
  // Blog Post methods
  async getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
    if (publishedOnly) {
      return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post as any).returning();
    return newPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({...(post as any), updatedAt: new Date()})
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  
  // Site Settings methods
  async getSiteSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings).orderBy(siteSettings.key);
  }
  
  async getSiteSettingsByCategory(category: string): Promise<SiteSetting[]> {
    return db.select().from(siteSettings).where(eq(siteSettings.category, category)).orderBy(siteSettings.key);
  }
  
  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }
  
  async createOrUpdateSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const existingSetting = await this.getSiteSetting(setting.key);
    
    if (existingSetting) {
      const [updatedSetting] = await db
        .update(siteSettings)
        .set({...setting, updatedAt: new Date()})
        .where(eq(siteSettings.key, setting.key))
        .returning();
      return updatedSetting;
    } else {
      const [newSetting] = await db.insert(siteSettings).values(setting).returning();
      return newSetting;
    }
  }
  
  // Contact Message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  
  async getUnreadContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).where(eq(contactMessages.read, false)).orderBy(desc(contactMessages.createdAt));
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }
  
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updatedMessage;
  }
  
  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }
}

export const storage = new DatabaseStorage();
