import express from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../repositories/tripRepository.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const trip = await createTrip(req.body);

    res.status(201).json(trip);
  } catch (error) {
    console.error("Error creating trip:", error.message);

    res.status(500).json({
      message: "Could not create trip",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const trips = await getAllTrips();

    res.status(200).json(trips);
  } catch (error) {
    console.error("Error loading trips:", error.message);

    res.status(500).json({
      message: "Could not load trips",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);

    const trip = await getTripById(req.params.id);

    res.status(200).json(trip);
  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: error.message,
      statusCode: error.statusCode,
      reason: error.reason,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTrip = await updateTrip(req.params.id, req.body);

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error.message);

    res.status(500).json({
      message: "Could not update trip",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteTrip(req.params.id);

    res.status(200).json({
      message: "Trip deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Error deleting trip:", error.message);

    res.status(500).json({
      message: "Could not delete trip",
    });
  }
});

export default router;
