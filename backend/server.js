import express from "express";
import { getDatabase, createIndexes } from "./database/couchdb.js";
import tripRoutes from "./routes/tripRoutes.js";
import requestRoutes from "./routes/needRoutes.js";
import needRoutes from "./routes/needRoutes.js";
import cors from "cors";
import path from "path";
import matchRoutes from "./routes/matchRoutes.js";
import { cleanupExpiredData } from "./services/cleanupService.js";
import messageRoutes from "./routes/messageRoutes.js";
import http from "http";
import { initializeChatServer } from "./websocket/chatServer.js";
import userRoutes from "./routes/userRoutes.js";
import tripCompletionRoutes from "./routes/tripCompletionRoutes.js";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
const PORT = 3000;

app.use(express.json());

app.use("/api/matches", matchRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/messages", messageRoutes);

app.use("/api/users", userRoutes);

app.use("/api/trip-completions", tripCompletionRoutes);

app.get("/api", (req, res) => {
  res.json({
    message: "Take With You API is running",
  });
});

app.use("/api/trips", tripRoutes);
app.use("/api/needs", needRoutes);

async function startServer() {
  try {
    await getDatabase();
    await createIndexes();
    await cleanupExpiredData();

    initializeChatServer(server);

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    setInterval(() => {
      cleanupExpiredData();
    }, TWENTY_FOUR_HOURS);
  } catch (error) {
    console.error("Could not connect to CouchDB:");
    console.error(error.message);
  }
}

startServer();
