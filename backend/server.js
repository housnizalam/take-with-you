import express from "express";
import { getDatabase } from "./database/couchdb.js";
import tripRoutes from "./routes/tripRoutes.js";
import requestRoutes from "./routes/needRoutes.js";
import needRoutes from "./routes/needRoutes.js";
import cors from "cors";
import path from "path";
import { geocodeLocation } from "./services/geocodingService.js";
import { calculateDistanceKm } from "./services/distanceService.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
const PORT = 3000;

app.use(express.json());

app.get("/api/test-geocode", async (req, res) => {
  try {
    const location = await geocodeLocation("Kassel");

    res.json(location);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/test-distance", (req, res) => {
  const distance = calculateDistanceKm(
    51.3157833,
    9.4978479,
    51.3600,
    9.4700
  );

  res.json({
    distanceKm: distance
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to CouchDB:");
    console.error(error.message);
  }
}

startServer();
