import express from "express";
import {
  createNeed,
  getAllNeeds,
  getNeedById,
  updateNeed,
  deleteNeed,
} from "../repositories/needRepository.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const need = await createNeed(req.body);

    res.status(201).json(need);
  } catch (error) {
    console.error("Error creating need:", error.message);

    res.status(500).json({
      message: "Could not create need",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const needs = await getAllNeeds();

    res.status(200).json(needs);
  } catch (error) {
    console.error("Error loading needs:", error.message);

    res.status(500).json({
      message: "Could not load needs",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("Requested Need ID:", req.params.id);

    const need = await getNeedById(req.params.id);

    res.status(200).json(need);
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
    const updatedNeed = await updateNeed(req.params.id, req.body);

    res.status(200).json(updatedNeed);
  } catch (error) {
    console.error("Error updating need:", error.message);

    res.status(500).json({
      message: "Could not update need",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteNeed(req.params.id);

    res.status(200).json({
      message: "Need deleted successfully",
      result
    });
  } catch (error) {
    console.error("Error deleting need:", error.message);

    res.status(500).json({
      message: "Could not delete need"
    });
  }
});

export default router;
