import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { connectDB, initPromotionsTable } from "./config/db";
import { ENV } from "./config/env";

const PORT = Number(ENV.PORT);

const startServer = async () => {
  // Start server immediately - connect to DB in background
  // Bind to 0.0.0.0 to accept connections from Android emulator and other network devices
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    // Attempt DB connection in background without blocking
    connectDB().then((dbConnected) => {
      if (dbConnected) {
        console.log("Database connected successfully");
        // Initialize the promotions table
        initPromotionsTable();
        console.log("Promotions table initialized");
      } else {
        console.warn("Database unavailable - some features may not work");
      }
    }).catch((err) => {
      console.warn("Database connection failed:", err instanceof Error ? err.message : err);
    });
  });
};

startServer();
