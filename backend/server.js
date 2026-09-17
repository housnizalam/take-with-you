import express from "express";
import { getDatabase } from "./database/couchdb.js";
import tripRoutes from "./routes/tripRoutes.js";
import requestRoutes from "./routes/needRoutes.js";
import needRoutes from "./routes/needRoutes.js";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
const PORT = 3000;

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.get("/api", (req, res) => {
  res.json({
    message: "Take With You API is running"
  });
});

app.use("/api/trips", tripRoutes);
app.use("/api/needs", needRoutes);

async function startServer() {
  try {
    await getDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to CouchDB:");
    console.error(error.message);
  }
}

startServer();