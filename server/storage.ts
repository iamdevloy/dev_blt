import { 
  users, 
  admins, 
  customers, 
  customerSettings, 
  usageStats,
  type User, 
  type InsertUser,
  type Admin,
  type InsertAdmin,
  type Customer,
  type InsertCustomer,
  type CustomerSettings,
  type InsertCustomerSettings,
  type UsageStats
} from "@shared/schema";

export interface IStorage {
  // Legacy user methods (preserved)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin methods
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  getAllAdmins(): Promise<Admin[]>;
  
  // Customer methods
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByUsername(username: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  deactivateCustomer(id: number): Promise<boolean>;
  
  // Customer settings methods
  getCustomerSettings(customerId: number): Promise<CustomerSettings | undefined>;
  createCustomerSettings(settings: InsertCustomerSettings): Promise<CustomerSettings>;
  updateCustomerSettings(customerId: number, updates: Partial<CustomerSettings>): Promise<CustomerSettings | undefined>;
  
  // Usage statistics methods
  getUsageStats(customerId: number): Promise<UsageStats | undefined>;
  updateUsageStats(customerId: number, updates: Partial<UsageStats>): Promise<UsageStats | undefined>;
  createUsageStats(customerId: number): Promise<UsageStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private admins: Map<number, Admin>;
  private customers: Map<number, Customer>;
  private customerSettingsMap: Map<number, CustomerSettings>;
  private usageStatsMap: Map<number, UsageStats>;
  private currentUserId: number;
  private currentAdminId: number;
  private currentCustomerId: number;
  private currentSettingsId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.admins = new Map();
    this.customers = new Map();
    this.customerSettingsMap = new Map();
    this.usageStatsMap = new Map();
    this.currentUserId = 1;
    this.currentAdminId = 1;
    this.currentCustomerId = 1;
    this.currentSettingsId = 1;
    this.currentStatsId = 1;
    
    // Create default admin account
    this.createAdmin({
      username: "admin",
      password: "admin123" // In production, this should be hashed
    });

    // Create demo customers
    this.createDemoCustomers();
  }

  // Legacy user methods (preserved)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Admin methods
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username,
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const admin: Admin = { 
      ...insertAdmin, 
      id, 
      createdAt: new Date() 
    };
    this.admins.set(id, admin);
    return admin;
  }

  async getAllAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  // Customer methods
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByUsername(username: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.username === username,
    );
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.email === email,
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentCustomerId++;
    const customer: Customer = { 
      ...insertCustomer, 
      id, 
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.set(id, customer);
    
    // Create default settings for new customer
    await this.createCustomerSettings({
      customerId: id,
      siteName: `${customer.username}'s Wedding Gallery`,
      primaryColor: "#8B5CF6",
      secondaryColor: "#A855F7",
      accentColor: "#C084FC",
      themeId: "default"
    });

    // Create usage stats
    await this.createUsageStats(id);
    
    return customer;
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { 
      ...customer, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async deactivateCustomer(id: number): Promise<boolean> {
    const customer = this.customers.get(id);
    if (!customer) return false;
    
    const deactivatedCustomer = { 
      ...customer, 
      isActive: false, 
      updatedAt: new Date() 
    };
    this.customers.set(id, deactivatedCustomer);
    return true;
  }

  // Customer settings methods
  async getCustomerSettings(customerId: number): Promise<CustomerSettings | undefined> {
    return Array.from(this.customerSettingsMap.values()).find(
      (settings) => settings.customerId === customerId,
    );
  }

  async createCustomerSettings(insertSettings: InsertCustomerSettings): Promise<CustomerSettings> {
    const id = this.currentSettingsId++;
    const settings: CustomerSettings = { 
      id,
      customerId: insertSettings.customerId,
      siteName: insertSettings.siteName || "My Wedding Gallery",
      profileImageUrl: insertSettings.profileImageUrl || null,
      logoUrl: insertSettings.logoUrl || null,
      primaryColor: insertSettings.primaryColor || "#8B5CF6",
      secondaryColor: insertSettings.secondaryColor || "#A855F7",
      accentColor: insertSettings.accentColor || "#C084FC",
      customTexts: insertSettings.customTexts || null,
      socialLinks: insertSettings.socialLinks || null,
      contactInfo: insertSettings.contactInfo || null,
      themeId: insertSettings.themeId || "default",
      updatedAt: new Date()
    };
    this.customerSettingsMap.set(id, settings);
    return settings;
  }

  async updateCustomerSettings(customerId: number, updates: Partial<CustomerSettings>): Promise<CustomerSettings | undefined> {
    const settings = await this.getCustomerSettings(customerId);
    if (!settings) return undefined;
    
    const updatedSettings = { 
      ...settings, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.customerSettingsMap.set(settings.id, updatedSettings);
    return updatedSettings;
  }

  // Usage statistics methods
  async getUsageStats(customerId: number): Promise<UsageStats | undefined> {
    return Array.from(this.usageStatsMap.values()).find(
      (stats) => stats.customerId === customerId,
    );
  }

  async updateUsageStats(customerId: number, updates: Partial<UsageStats>): Promise<UsageStats | undefined> {
    const stats = await this.getUsageStats(customerId);
    if (!stats) return undefined;
    
    const updatedStats = { 
      ...stats, 
      ...updates, 
      lastActivity: new Date() 
    };
    this.usageStatsMap.set(stats.id, updatedStats);
    return updatedStats;
  }

  async createUsageStats(customerId: number): Promise<UsageStats> {
    const id = this.currentStatsId++;
    const stats: UsageStats = {
      id,
      customerId,
      totalViews: 0,
      uniqueVisitors: 0,
      mediaUploads: 0,
      lastActivity: new Date()
    };
    this.usageStatsMap.set(id, stats);
    return stats;
  }

  private async createDemoCustomers() {
    // Create demo customer accounts
    const demoCustomers = [
      {
        username: "john_jane",
        email: "john.jane@example.com",
        password: "demo123"
      },
      {
        username: "sarah_mike",
        email: "sarah.mike@example.com", 
        password: "demo123"
      },
      {
        username: "emma_david",
        email: "emma.david@example.com",
        password: "demo123"
      }
    ];

    for (const customer of demoCustomers) {
      await this.createCustomer(customer);
    }
  }
}

export const storage = new MemStorage();
