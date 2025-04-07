import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertCakeSchema, insertReviewSchema, cakeCategoryEnum } from "@shared/schema";
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
      const cake = await storage.createCake(validatedData);
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
      
      const updatedCake = await storage.updateCake(id, validatedData);
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

  return httpServer;
}
