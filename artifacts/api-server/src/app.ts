import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production: serve the built frontend static files
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../streamtv/dist/public");
  app.use(express.static(frontendDist));
  // SPA fallback – return index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
