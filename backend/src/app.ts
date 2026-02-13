import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import promotionsRoutes from "./routes/promotions.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/promotions", promotionsRoutes);

app.get("/health", (_, res) => res.json({ status: "OK" }));
app.get("/", (_, res) => res.json({ status: "OK", message: "Promotions API running" }));

app.use(errorHandler);
