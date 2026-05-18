import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const adminDist = path.join(__dirname, "../../admin/dist/public");
  const storeDist = path.join(__dirname, "../../space-caps/dist/public");

  app.use("/admin", express.static(adminDist));
  app.get("/admin/{*path}", (_req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });

  app.use(express.static(storeDist));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(storeDist, "index.html"));
  });
}

export default app;
