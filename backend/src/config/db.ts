import betterSqlite3 from "better-sqlite3";
import path from "path";

// Create a SQLite database instance
const dbPath = path.join(__dirname, "../../promotions.db");
export const pool = betterSqlite3(dbPath);

// Enable WAL mode for better performance
pool.pragma("journal_mode = WAL");

let dbAvailable = false;

// Helper function to add timeout to promises (for compatibility)
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Database operation timed out")), timeoutMs);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

const DB_QUERY_TIMEOUT_MS = Number(process.env.DB_QUERY_TIMEOUT_MS || 10000);

export const queryWithTimeout = async <T extends unknown[] = unknown[]>(
  sql: string,
  params: unknown[] = []
): Promise<T> => {
  if (!dbAvailable) {
    throw new Error("Database unavailable");
  }

  try {
    const stmt = pool.prepare(sql);
    const result = params.length > 0 ? stmt.all(...params) : stmt.all();
    return result as T;
  } catch (error) {
    console.error("SQLite query error:", error);
    throw error;
  }
};

export const connectDB = async () => {
  try {
    // Test the database connection
    pool.prepare("SELECT 1").get();
    dbAvailable = true;
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    dbAvailable = false;
    console.warn("Database connection failed (server will continue without DB):", error instanceof Error ? error.message : error);
    return false;
  }
};

// Initialize the promotions table matching the MySQL schema
export const initPromotionsTable = () => {
  pool.exec(`
    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      promo_code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'PERCENTAGE',
      value REAL DEFAULT 0,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      usage_limit INTEGER DEFAULT NULL,
      usage_count INTEGER DEFAULT 0,
      min_order_amount REAL DEFAULT 0,
      max_discount_amount REAL DEFAULT NULL,
      custom_items TEXT DEFAULT NULL,
      description TEXT DEFAULT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration: add columns that may be missing from older schema versions
  const existingColumns = (pool.prepare("PRAGMA table_info(promotions)").all() as { name: string }[]).map(
    (col) => col.name
  );

  if (!existingColumns.includes("min_order_amount")) {
    pool.exec("ALTER TABLE promotions ADD COLUMN min_order_amount REAL DEFAULT 0");
    console.log("Migration: added column min_order_amount");
  }
  if (!existingColumns.includes("max_discount_amount")) {
    pool.exec("ALTER TABLE promotions ADD COLUMN max_discount_amount REAL DEFAULT NULL");
    console.log("Migration: added column max_discount_amount");
  }
  if (!existingColumns.includes("description")) {
    pool.exec("ALTER TABLE promotions ADD COLUMN description TEXT DEFAULT NULL");
    console.log("Migration: added column description");
  }
  
  // Insert sample data if empty
  const count = pool.prepare("SELECT COUNT(*) as count FROM promotions").get() as { count: number };
  if (count.count === 0) {
    const insertStmt = pool.prepare(`
      INSERT INTO promotions (promo_code, title, type, value, start_at, end_at, status, usage_limit, min_order_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertStmt.run("WELCOME10", "Welcome Discount", "PERCENTAGE", 10.00, "2024-01-01 00:00:00", "2025-12-31 23:59:59", "ACTIVE", 100, 100);
    insertStmt.run("FLAT50", "Flat ₹50 Off", "FIXED", 50.00, "2024-01-01 00:00:00", "2025-12-31 23:59:59", "ACTIVE", 50, 200);
    console.log("Sample promotions created");
  }
};

// Get all menu items from the main app's database
export const getMenuItems = () => {
  try {
    // Try to connect to the main app's database
    const mainDbPath = path.join(__dirname, "../../../database/restaurant.db");
    let mainDb;
    try {
      mainDb = betterSqlite3(mainDbPath);
      const items = mainDb.prepare("SELECT id, name, description, price, category FROM menu_items WHERE isAvailable = 1 ORDER BY category, name").all();
      mainDb.close();
      return items;
    } catch (e) {
      // Main DB not accessible, return empty array
      console.log("Main database not accessible for menu items");
      return [];
    }
  } catch (error) {
    console.error("Error getting menu items:", error);
    return [];
  }
};

