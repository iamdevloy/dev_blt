import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Customer/Client accounts table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customer customization settings
export const customerSettings = pgTable("customer_settings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  siteName: text("site_name").default("My Wedding Gallery").notNull(),
  profileImageUrl: text("profile_image_url"),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#8B5CF6").notNull(),
  secondaryColor: text("secondary_color").default("#A855F7").notNull(),
  accentColor: text("accent_color").default("#C084FC").notNull(),
  customTexts: jsonb("custom_texts"),
  socialLinks: jsonb("social_links"),
  contactInfo: jsonb("contact_info"),
  themeId: text("theme_id").default("default").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Wedding galleries table
export const weddingGalleries = pgTable("wedding_galleries", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  weddingDate: text("wedding_date"),
  coupleNames: text("couple_names").notNull(),
  profileImageUrl: text("profile_image_url"),
  welcomeMessage: text("welcome_message"),
  customTexts: jsonb("custom_texts"),
  branding: jsonb("branding"), // colors, fonts, etc.
  mediaItems: jsonb("media_items").default('[]').notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Usage statistics
export const usageStats = pgTable("usage_stats", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  totalViews: integer("total_views").default(0).notNull(),
  uniqueVisitors: integer("unique_visitors").default(0).notNull(),
  mediaUploads: integer("media_uploads").default(0).notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

// Existing users table (preserved for backward compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Schema definitions
export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  username: true,
  email: true,
  password: true,
});

export const insertCustomerSettingsSchema = createInsertSchema(customerSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertWeddingGallerySchema = createInsertSchema(weddingGalleries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertCustomerSettings = z.infer<typeof insertCustomerSettingsSchema>;
export type CustomerSettings = typeof customerSettings.$inferSelect;

export type InsertWeddingGallery = z.infer<typeof insertWeddingGallerySchema>;
export type WeddingGallery = typeof weddingGalleries.$inferSelect;

export type UsageStats = typeof usageStats.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
