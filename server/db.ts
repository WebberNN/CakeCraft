import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  cakes, reviews, users, galleryImages, 
  recipes, specialOffers, blogPosts, 
  siteSettings, contactMessages 
} from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;
export const pool = postgres(connectionString, { max: 10 });
export const db = drizzle(pool, { 
  schema: { 
    users, cakes, reviews, galleryImages,
    recipes, specialOffers, blogPosts, 
    siteSettings, contactMessages
  } 
});