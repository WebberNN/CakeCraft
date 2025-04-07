import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertCakeSchema, insertReviewSchema, insertGalleryImageSchema, cakeCategoryEnum,
  insertRecipeSchema, insertSpecialOfferSchema, insertBlogPostSchema,
  insertSiteSettingSchema, insertContactMessageSchema,
  recipeCategoryEnum, difficultyEnum
} from "@shared/schema";
import { z } from "zod";

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Not authorized" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  const httpServer = createServer(app);

  // Cake routes
  app.get("/api/cakes", async (req, res) => {
    try {
      const cakes = await storage.getCakes();
      res.json(cakes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cakes" });
    }
  });
  
  app.get("/api/cakes/featured", async (req, res) => {
    try {
      const cakes = await storage.getFeaturedCakes();
      res.json(cakes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured cakes" });
    }
  });
  
  app.get("/api/cakes/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      // Validate category
      if (!Object.values(cakeCategoryEnum.enumValues).includes(category as any)) {
        return res.status(400).json({ error: "Invalid category" });
      }
      
      const cakes = await storage.getCakesByCategory(category);
      res.json(cakes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cakes by category" });
    }
  });
  
  app.get("/api/cakes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const cake = await storage.getCake(id);
      if (!cake) {
        return res.status(404).json({ error: "Cake not found" });
      }
      
      res.json(cake);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cake" });
    }
  });
  
  // Admin cake routes
  app.get("/api/admin/cakes", isAdmin, async (req, res) => {
    try {
      const cakes = await storage.getCakes();
      res.json(cakes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cakes" });
    }
  });
  
  app.post("/api/admin/cakes", isAdmin, async (req, res) => {
    try {
      const validatedData = insertCakeSchema.parse(req.body);
      
      // Convert price to number if it's a string
      const dataToSave = {
        ...validatedData,
        price: typeof validatedData.price === 'string' 
          ? parseFloat(validatedData.price) 
          : validatedData.price
      };
      
      const cake = await storage.createCake(dataToSave);
      res.status(201).json(cake);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create cake" });
    }
  });
  
  app.put("/api/admin/cakes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      // Partial validation of the update data
      const validatedData = insertCakeSchema.partial().parse(req.body);
      
      // Process the data before updating
      const dataToUpdate = { ...validatedData };
      
      // Convert price to number if it's a string and exists
      if (dataToUpdate.price !== undefined && typeof dataToUpdate.price === 'string') {
        dataToUpdate.price = parseFloat(dataToUpdate.price);
      }
      
      const updatedCake = await storage.updateCake(id, dataToUpdate);
      if (!updatedCake) {
        return res.status(404).json({ error: "Cake not found" });
      }
      
      res.json(updatedCake);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update cake" });
    }
  });
  
  app.delete("/api/admin/cakes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const cake = await storage.getCake(id);
      if (!cake) {
        return res.status(404).json({ error: "Cake not found" });
      }
      
      await storage.deleteCake(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cake" });
    }
  });
  
  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      // By default, only return approved reviews for public API
      const reviews = await storage.getReviews(true);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });
  
  // Admin review routes
  app.get("/api/admin/reviews", isAdmin, async (req, res) => {
    try {
      // For admin, return all reviews including unapproved ones
      const reviews = await storage.getReviews(false);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  
  app.patch("/api/admin/reviews/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const review = await storage.approveReview(id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve review" });
    }
  });
  
  app.delete("/api/admin/reviews/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const review = await storage.getReview(id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      
      await storage.deleteReview(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });
  
  app.get("/api/gallery/featured", async (req, res) => {
    try {
      const images = await storage.getFeaturedGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured gallery images" });
    }
  });
  
  app.get("/api/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const image = await storage.getGalleryImage(id);
      if (!image) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery image" });
    }
  });
  
  // Admin gallery routes
  app.get("/api/admin/gallery", isAdmin, async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });
  
  app.post("/api/admin/gallery", isAdmin, async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create gallery image" });
    }
  });
  
  app.put("/api/admin/gallery/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      // Partial validation of the update data
      const validatedData = insertGalleryImageSchema.partial().parse(req.body);
      
      const updatedImage = await storage.updateGalleryImage(id, validatedData);
      if (!updatedImage) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      
      res.json(updatedImage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update gallery image" });
    }
  });
  
  app.delete("/api/admin/gallery/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const image = await storage.getGalleryImage(id);
      if (!image) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      
      await storage.deleteGalleryImage(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete gallery image" });
    }
  });
  
  // Recipe routes
  app.get("/api/recipes", async (req, res) => {
    try {
      const recipes = await storage.getRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });
  
  app.get("/api/recipes/featured", async (req, res) => {
    try {
      const recipes = await storage.getFeaturedRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured recipes" });
    }
  });
  
  app.get("/api/recipes/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      // Validate category
      if (!Object.values(recipeCategoryEnum.enumValues).includes(category as any)) {
        return res.status(400).json({ error: "Invalid category" });
      }
      
      const recipes = await storage.getRecipesByCategory(category);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes by category" });
    }
  });
  
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipe" });
    }
  });
  
  // Admin recipe routes
  app.get("/api/admin/recipes", isAdmin, async (req, res) => {
    try {
      const recipes = await storage.getRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });
  
  app.post("/api/admin/recipes", isAdmin, async (req, res) => {
    try {
      const validatedData = insertRecipeSchema.parse(req.body);
      const recipe = await storage.createRecipe(validatedData);
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create recipe" });
    }
  });
  
  app.put("/api/admin/recipes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      // Partial validation of the update data
      const validatedData = insertRecipeSchema.partial().parse(req.body);
      
      const updatedRecipe = await storage.updateRecipe(id, validatedData);
      if (!updatedRecipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      
      res.json(updatedRecipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update recipe" });
    }
  });
  
  app.delete("/api/admin/recipes/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      
      await storage.deleteRecipe(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete recipe" });
    }
  });
  
  // Special Offer routes
  app.get("/api/offers", async (req, res) => {
    try {
      // By default, only return active offers for public API
      const offers = await storage.getSpecialOffers(true);
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch special offers" });
    }
  });
  
  app.get("/api/offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const offer = await storage.getSpecialOffer(id);
      if (!offer) {
        return res.status(404).json({ error: "Special offer not found" });
      }
      
      res.json(offer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch special offer" });
    }
  });
  
  // Admin special offer routes
  app.get("/api/admin/offers", isAdmin, async (req, res) => {
    try {
      // For admin, return all offers including inactive ones
      const offers = await storage.getSpecialOffers(false);
      res.json(offers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch special offers" });
    }
  });
  
  app.post("/api/admin/offers", isAdmin, async (req, res) => {
    try {
      const validatedData = insertSpecialOfferSchema.parse(req.body);
      
      // Convert prices to numbers if they're strings
      const dataToSave = {
        ...validatedData,
        price: typeof validatedData.price === 'string' 
          ? parseFloat(validatedData.price) 
          : validatedData.price,
        originalPrice: typeof validatedData.originalPrice === 'string' 
          ? parseFloat(validatedData.originalPrice) 
          : validatedData.originalPrice
      };
      
      const offer = await storage.createSpecialOffer(dataToSave);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create special offer" });
    }
  });
  
  app.put("/api/admin/offers/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      // Partial validation of the update data
      const validatedData = insertSpecialOfferSchema.partial().parse(req.body);
      
      // Process the data before updating
      const dataToUpdate = { ...validatedData };
      
      // Convert prices to numbers if they're strings and exist
      if (dataToUpdate.price !== undefined && typeof dataToUpdate.price === 'string') {
        dataToUpdate.price = parseFloat(dataToUpdate.price);
      }
      
      if (dataToUpdate.originalPrice !== undefined && typeof dataToUpdate.originalPrice === 'string') {
        dataToUpdate.originalPrice = parseFloat(dataToUpdate.originalPrice);
      }
      
      const updatedOffer = await storage.updateSpecialOffer(id, dataToUpdate);
      if (!updatedOffer) {
        return res.status(404).json({ error: "Special offer not found" });
      }
      
      res.json(updatedOffer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update special offer" });
    }
  });
  
  app.delete("/api/admin/offers/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const offer = await storage.getSpecialOffer(id);
      if (!offer) {
        return res.status(404).json({ error: "Special offer not found" });
      }
      
      await storage.deleteSpecialOffer(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete special offer" });
    }
  });
  
  // Blog Post routes
  app.get("/api/blog", async (req, res) => {
    try {
      // By default, only return published posts for public API
      const posts = await storage.getBlogPosts(true);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Only return published posts for public API
      if (!post.published) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
  
  // Admin blog post routes
  app.get("/api/admin/blog", isAdmin, async (req, res) => {
    try {
      // For admin, return all posts including unpublished ones
      const posts = await storage.getBlogPosts(false);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });
  
  app.get("/api/admin/blog/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });
  
  app.post("/api/admin/blog", isAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });
  
  app.put("/api/admin/blog/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      // Partial validation of the update data
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      
      const updatedPost = await storage.updateBlogPost(id, validatedData);
      if (!updatedPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });
  
  app.delete("/api/admin/blog/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });
  
  // Site Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });
  
  app.get("/api/settings/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const settings = await storage.getSiteSettingsByCategory(category);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings by category" });
    }
  });
  
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const setting = await storage.getSiteSetting(key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site setting" });
    }
  });
  
  // Admin site settings routes
  app.post("/api/admin/settings", isAdmin, async (req, res) => {
    try {
      const validatedData = insertSiteSettingSchema.parse(req.body);
      const setting = await storage.createOrUpdateSiteSetting(validatedData);
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create/update site setting" });
    }
  });
  
  // Contact Message routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create contact message" });
    }
  });
  
  // Admin contact message routes
  app.get("/api/admin/messages", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });
  
  app.get("/api/admin/messages/unread", isAdmin, async (req, res) => {
    try {
      const messages = await storage.getUnreadContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread contact messages" });
    }
  });
  
  app.get("/api/admin/messages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const message = await storage.getContactMessage(id);
      if (!message) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact message" });
    }
  });
  
  app.patch("/api/admin/messages/:id/read", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const message = await storage.markContactMessageAsRead(id);
      if (!message) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark contact message as read" });
    }
  });
  
  app.delete("/api/admin/messages/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const message = await storage.getContactMessage(id);
      if (!message) {
        return res.status(404).json({ error: "Contact message not found" });
      }
      
      await storage.deleteContactMessage(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact message" });
    }
  });

  return httpServer;
}
