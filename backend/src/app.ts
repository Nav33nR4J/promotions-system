import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { getMenuItems } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";
import promotionsRoutes from "./routes/promotions.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/promotions", promotionsRoutes);

// Menu items endpoint for promotion custom items selection
app.get("/api/menu-items", (_, res) => {
  try {
    const items = getMenuItems();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ success: false, error: "Failed to fetch menu items" });
  }
});

app.get("/health", (_, res) => res.json({ status: "OK" }));
app.get("/", (_, res) => res.json({ status: "OK", message: "Promotions API running" }));

app.use(errorHandler);

