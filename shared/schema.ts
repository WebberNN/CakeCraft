import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, decimal } from "drizzle-orm/pg-core";
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

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCake = z.infer<typeof insertCakeSchema>;
export type Cake = typeof cakes.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImages.$inferSelect;
