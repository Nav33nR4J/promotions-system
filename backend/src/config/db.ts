import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 second timeout for connections
});

let dbAvailable = false;

// Helper function to add timeout to promises
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

  return withTimeout(
    pool.query(sql, params) as unknown as Promise<T>,
    DB_QUERY_TIMEOUT_MS
  );
};

export const connectDB = async () => {
  try {
    const connection = await withTimeout(pool.getConnection(), 10000); // 10 second timeout
    await withTimeout(connection.ping(), 5000);
    connection.release();
    dbAvailable = true;
    console.log("Database connected successfully");
    return true;
  } catch (error) {
    dbAvailable = false;
    console.warn("Database connection failed (server will continue without DB):", error instanceof Error ? error.message : error);
    return false;
  }
};
