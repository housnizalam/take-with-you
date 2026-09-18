import express from "express";
import { getNeedById } from "../repositories/needRepository.js";
import { getTripsByDateRange } from "../repositories/tripRepository.js";
import { findMatchingTrips } from "../services/matchingService.js";

const router = express.Router();

router.get("/need/:needId", async (req, res) => {
  try {
    const need = await getNeedById(req.params.needId);

    const trips = await getTripsByDateRange(need.dateFrom, need.dateTo);

    const matches = findMatchingTrips(trips, need);

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error finding matches:", error.message);

    res.status(500).json({
      message: "Could not find matches",
    });
  }
});

export default router;
