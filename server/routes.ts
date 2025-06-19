import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAdminSchema, insertCustomerSchema, insertCustomerSettingsSchema, insertWeddingGallerySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ 
        success: true, 
        admin: { id: admin.id, username: admin.username },
        message: "Admin login successful" 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Customer login
  app.post("/api/customer/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const customer = await storage.getCustomerByUsername(username);
      if (!customer || customer.password !== password || !customer.isActive) {
        return res.status(401).json({ message: "Invalid credentials or account deactivated" });
      }
      
      // Get customer settings
      const settings = await storage.getCustomerSettings(customer.id);
      
      res.json({ 
        success: true, 
        customer: { 
          id: customer.id, 
          username: customer.username, 
          email: customer.email 
        },
        settings,
        message: "Customer login successful" 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes
  
  // Get all customers (admin only)
  app.get("/api/admin/customers", async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      const customersWithStats = await Promise.all(
        customers.map(async (customer) => {
          const stats = await storage.getUsageStats(customer.id);
          return { ...customer, stats };
        })
      );
      
      res.json(customersWithStats);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create customer (admin only)
  app.post("/api/admin/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingByUsername = await storage.getCustomerByUsername(validatedData.username);
      const existingByEmail = await storage.getCustomerByEmail(validatedData.email);
      
      if (existingByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      if (existingByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json({ customer, message: "Customer created successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update customer (admin only)
  app.put("/api/admin/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const customer = await storage.updateCustomer(id, updates);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json({ customer, message: "Customer updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Deactivate customer (admin only)
  app.delete("/api/admin/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const success = await storage.deactivateCustomer(id);
      if (!success) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json({ message: "Customer deactivated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Customer routes
  
  // Get customer settings
  app.get("/api/customer/:id/settings", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const settings = await storage.getCustomerSettings(customerId);
      
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update customer settings
  app.put("/api/customer/:id/settings", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const updates = req.body;
      
      const settings = await storage.updateCustomerSettings(customerId, updates);
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      
      res.json({ settings, message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update usage statistics
  app.post("/api/customer/:id/stats", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const updates = req.body;
      
      const stats = await storage.updateUsageStats(customerId, updates);
      if (!stats) {
        return res.status(404).json({ message: "Statistics not found" });
      }
      
      res.json({ stats, message: "Statistics updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get customer profile (for customer dashboard)
  app.get("/api/customer/:id/profile", async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      
      const customer = await storage.getCustomer(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      const settings = await storage.getCustomerSettings(customerId);
      const stats = await storage.getUsageStats(customerId);
      
      res.json({ customer, settings, stats });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wedding Gallery Routes
  
  // Get all galleries for a customer
  app.get("/api/customer/:customerId/galleries", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const galleries = await storage.getWeddingGalleriesByCustomer(customerId);
      res.json(galleries);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get a specific gallery by slug (public route)
  app.get("/api/gallery/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const gallery = await storage.getWeddingGalleryBySlug(slug);
      
      if (!gallery || !gallery.isPublished) {
        return res.status(404).json({ message: "Gallery not found or not published" });
      }
      
      res.json(gallery);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new wedding gallery
  app.post("/api/customer/:customerId/galleries", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      
      const validatedData = insertWeddingGallerySchema.parse({
        ...req.body,
        customerId
      });
      
      // Check if slug is already taken
      const existingGallery = await storage.getWeddingGalleryBySlug(validatedData.slug);
      if (existingGallery) {
        return res.status(400).json({ message: "Slug already exists" });
      }
      
      const gallery = await storage.createWeddingGallery(validatedData);
      res.status(201).json(gallery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update a wedding gallery
  app.put("/api/galleries/:id", async (req, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      
      const validatedData = insertWeddingGallerySchema.partial().parse(req.body);
      
      const updatedGallery = await storage.updateWeddingGallery(galleryId, validatedData);
      
      if (!updatedGallery) {
        return res.status(404).json({ message: "Gallery not found" });
      }
      
      res.json(updatedGallery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete a wedding gallery
  app.delete("/api/galleries/:id", async (req, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      
      const deleted = await storage.deleteWeddingGallery(galleryId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Gallery not found" });
      }
      
      res.json({ message: "Gallery deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
