import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./config/corsConfig";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

export default app;
