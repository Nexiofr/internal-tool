import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertEmailCaseSchema,
  insertVehicleSchema,
  insertWaitlistRequestSchema,
  insertKnowledgeItemSchema,
  insertClientSchema,
  insertUserSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ==================== EMAILS ====================
  
  // Get all emails (with optional filters)
  app.get("/api/emails", async (req, res) => {
    try {
      const { status, priority, needsHuman } = req.query;
      const emails = await storage.getEmailCases({
        status: status as string | undefined,
        priority: priority as string | undefined,
        needsHuman: needsHuman !== undefined ? needsHuman === "true" : undefined,
      });
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  // Get single email
  app.get("/api/emails/:id", async (req, res) => {
    try {
      const email = await storage.getEmailCase(req.params.id);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      res.json(email);
    } catch (error) {
      console.error("Error fetching email:", error);
      res.status(500).json({ error: "Failed to fetch email" });
    }
  });

  // Create email
  app.post("/api/emails", async (req, res) => {
    try {
      const validated = insertEmailCaseSchema.parse(req.body);
      const email = await storage.createEmailCase(validated);
      res.status(201).json(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating email:", error);
      res.status(500).json({ error: "Failed to create email" });
    }
  });

  // Update email
  app.patch("/api/emails/:id", async (req, res) => {
    try {
      const email = await storage.updateEmailCase(req.params.id, req.body);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      res.json(email);
    } catch (error) {
      console.error("Error updating email:", error);
      res.status(500).json({ error: "Failed to update email" });
    }
  });

  // Delete email
  app.delete("/api/emails/:id", async (req, res) => {
    try {
      await storage.deleteEmailCase(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting email:", error);
      res.status(500).json({ error: "Failed to delete email" });
    }
  });

  // ==================== VEHICLES ====================

  // Get all vehicles
  app.get("/api/vehicles", async (req, res) => {
    try {
      const { status } = req.query;
      const vehicles = await storage.getVehicles({
        status: status as string | undefined,
      });
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  // Get single vehicle
  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  // Create vehicle
  app.post("/api/vehicles", async (req, res) => {
    try {
      const validated = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validated);
      res.status(201).json(vehicle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating vehicle:", error);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  });

  // Update vehicle
  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.updateVehicle(req.params.id, req.body);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  // Delete vehicle
  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      await storage.deleteVehicle(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // ==================== WAITLIST ====================

  // Get all waitlist requests
  app.get("/api/waitlist", async (req, res) => {
    try {
      const { status } = req.query;
      const requests = await storage.getWaitlistRequests({
        status: status as string | undefined,
      });
      res.json(requests);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      res.status(500).json({ error: "Failed to fetch waitlist" });
    }
  });

  // Get single waitlist request
  app.get("/api/waitlist/:id", async (req, res) => {
    try {
      const request = await storage.getWaitlistRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Waitlist request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching waitlist request:", error);
      res.status(500).json({ error: "Failed to fetch waitlist request" });
    }
  });

  // Create waitlist request
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validated = insertWaitlistRequestSchema.parse(req.body);
      const request = await storage.createWaitlistRequest(validated);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating waitlist request:", error);
      res.status(500).json({ error: "Failed to create waitlist request" });
    }
  });

  // Update waitlist request
  app.patch("/api/waitlist/:id", async (req, res) => {
    try {
      const request = await storage.updateWaitlistRequest(req.params.id, req.body);
      if (!request) {
        return res.status(404).json({ error: "Waitlist request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error updating waitlist request:", error);
      res.status(500).json({ error: "Failed to update waitlist request" });
    }
  });

  // Delete waitlist request
  app.delete("/api/waitlist/:id", async (req, res) => {
    try {
      await storage.deleteWaitlistRequest(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting waitlist request:", error);
      res.status(500).json({ error: "Failed to delete waitlist request" });
    }
  });

  // ==================== KNOWLEDGE BASE ====================

  // Get all knowledge items
  app.get("/api/knowledge", async (req, res) => {
    try {
      const { category } = req.query;
      const items = await storage.getKnowledgeItems(category as string | undefined);
      res.json(items);
    } catch (error) {
      console.error("Error fetching knowledge items:", error);
      res.status(500).json({ error: "Failed to fetch knowledge items" });
    }
  });

  // Get single knowledge item
  app.get("/api/knowledge/:id", async (req, res) => {
    try {
      const item = await storage.getKnowledgeItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Knowledge item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching knowledge item:", error);
      res.status(500).json({ error: "Failed to fetch knowledge item" });
    }
  });

  // Create knowledge item
  app.post("/api/knowledge", async (req, res) => {
    try {
      const validated = insertKnowledgeItemSchema.parse(req.body);
      const item = await storage.createKnowledgeItem(validated);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating knowledge item:", error);
      res.status(500).json({ error: "Failed to create knowledge item" });
    }
  });

  // Update knowledge item
  app.patch("/api/knowledge/:id", async (req, res) => {
    try {
      const item = await storage.updateKnowledgeItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Knowledge item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating knowledge item:", error);
      res.status(500).json({ error: "Failed to update knowledge item" });
    }
  });

  // Delete knowledge item
  app.delete("/api/knowledge/:id", async (req, res) => {
    try {
      await storage.deleteKnowledgeItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting knowledge item:", error);
      res.status(500).json({ error: "Failed to delete knowledge item" });
    }
  });

  // ==================== CLIENTS ====================

  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  // Get single client
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  // Create client
  app.post("/api/clients", async (req, res) => {
    try {
      const validated = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validated);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Update client
  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.updateClient(req.params.id, req.body);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  // ==================== USERS ====================

  // Get all users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      const safeUsers = users.map(({ password, ...rest }) => rest);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Create user
  app.post("/api/users", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Update user
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { password, ...safeData } = req.body;
      const user = await storage.updateUser(req.params.id, safeData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ==================== STATISTICS ====================

  // Get statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const stats = await storage.getDailyStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Get aggregated statistics
  app.get("/api/statistics/summary", async (req, res) => {
    try {
      // Return mock summary data for now - would aggregate from dailyStats in production
      const summary = {
        emails: {
          total: 156,
          aiResponses: 98,
          humanEscalations: 58,
          avgResponseTimeMinutes: 135,
        },
        calls: {
          total: 234,
          aiHandled: 187,
          transferred: 47,
          avgDurationSeconds: 270,
        },
        waitlist: {
          total: 120,
          conversions: 15,
          conversionRate: 12.5,
        },
      };
      res.json(summary);
    } catch (error) {
      console.error("Error fetching statistics summary:", error);
      res.status(500).json({ error: "Failed to fetch statistics summary" });
    }
  });

  return httpServer;
}
