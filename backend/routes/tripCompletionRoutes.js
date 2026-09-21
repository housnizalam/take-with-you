import express from "express";

import {
  createTripCompletion,
  getTripCompletionByConversationId,
  confirmTripCompletion,
} from "../repositories/tripCompletionRepository.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      tripId,
      conversationId,
      clientUserId,
      driverUserId,
    } = req.body;

    if (
      !tripId ||
      !conversationId ||
      !clientUserId ||
      !driverUserId
    ) {
      return res.status(400).json({
        message:
          "Missing required trip completion data",
      });
    }

    const existing =
      await getTripCompletionByConversationId(
        conversationId,
      );

    if (existing) {
      return res.status(200).json(existing);
    }

    const completion =
      await createTripCompletion({
        tripId,
        conversationId,
        clientUserId,
        driverUserId,
      });

    res.status(201).json(completion);
  } catch (error) {
    console.error(
      "Error creating trip completion:",
      error,
    );

    res.status(500).json({
      message:
        "Could not create trip completion",
    });
  }
});

router.get(
  "/conversation/:conversationId",
  async (req, res) => {
    try {
      const completion =
        await getTripCompletionByConversationId(
          req.params.conversationId,
        );

      res.status(200).json(completion);
    } catch (error) {
      console.error(
        "Error loading trip completion:",
        error,
      );

      res.status(500).json({
        message:
          "Could not load trip completion",
      });
    }
  },
);

router.put(
  "/conversation/:conversationId/confirm",
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          message: "userId is required",
        });
      }

      const completion =
        await confirmTripCompletion(
          req.params.conversationId,
          userId,
        );

      res.status(200).json(completion);
    } catch (error) {
      console.error(
        "Error confirming trip completion:",
        error,
      );

      res.status(500).json({
        message:
          "Could not confirm trip completion",
      });
    }
  },
);

export default router;