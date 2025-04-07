import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Category enum for cakes
export const cakeCategoryEnum = pgEnum("cake_category", [
  "signature", 
  "birthday", 
  "wedding", 
  "cupcakes", 
  "pastries", 
  "sausage_rolls", 
  "chin_chin",
  "custom"
]);

// Cake table for product listings
export const cakes = pgTable("cakes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: cakeCategoryEnum("category").notNull(),
  tag: text("tag"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reviews table for customer testimonials
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  review: text("review").notNull(),
  verified: boolean("verified").default(false).notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Gallery images table
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recipe difficulty enum
export const difficultyEnum = pgEnum("difficulty", [
  "Easy", 
  "Medium", 
  "Advanced"
]);

// Recipe category enum
export const recipeCategoryEnum = pgEnum("recipe_category", [
  "Cake", 
  "Dessert", 
  "Pastry", 
  "Bread", 
  "Cookie", 
  "Other"
]);

// Recipes table
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: recipeCategoryEnum("category").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  prepTime: text("prep_time").notNull(),
  image: text("image").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  tips: text("tips").array(),
  author: text("author").notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Special offers table
export const specialOffers = pgTable("special_offers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  discount: text("discount").notNull(),
  image: text("image").notNull(),
  endDate: text("end_date").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("cover_image").notNull(),
  author: text("author").notNull(),
  tags: text("tags").array(),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Site settings table for customizable content
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  category: text("category").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export const insertCakeSchema = createInsertSchema(cakes, {
  price: z.union([z.string(), z.number()]),
}).pick({
  name: true,
  price: true,
  description: true,
  image: true,
  category: true,
  tag: true,
  featured: true,
});

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.coerce.string()
}).pick({
  name: true,
  city: true,
  rating: true,
  review: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).pick({
  title: true,
  description: true,
  imageUrl: true,
  featured: true,
});

export const insertRecipeSchema = createInsertSchema(recipes, {
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()).optional(),
}).pick({
  title: true,
  description: true,
  category: true,
  difficulty: true,
  prepTime: true,
  image: true,
  ingredients: true,
  instructions: true,
  tips: true,
  author: true,
  featured: true,
});

export const insertSpecialOfferSchema = createInsertSchema(specialOffers, {
  price: z.union([z.string(), z.number()]),
  originalPrice: z.union([z.string(), z.number()]),
}).pick({
  name: true,
  description: true,
  price: true,
  originalPrice: true,
  discount: true,
  image: true,
  endDate: true,
  active: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  tags: z.array(z.string()).optional(),
}).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  coverImage: true,
  author: true,
  tags: true,
  published: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).pick({
  key: true,
  value: true,
  category: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCake = z.infer<typeof insertCakeSchema>;
export type Cake = typeof cakes.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export type InsertSpecialOffer = z.infer<typeof insertSpecialOfferSchema>;
export type SpecialOffer = typeof specialOffers.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
