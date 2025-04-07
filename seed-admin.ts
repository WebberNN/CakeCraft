import { db } from "./server/db";
import { users } from "./shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, "AbieImisi"));
    
    if (existingAdmin.length > 0) {
      console.log("Admin user already exists!");
      return;
    }
    
    // Create admin user
    const hashedPassword = await hashPassword("Imisiwebber25");
    const [admin] = await db.insert(users).values({
      username: "AbieImisi",
      password: hashedPassword,
      isAdmin: true
    }).returning();
    
    console.log("Admin user created successfully:", admin.username);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();