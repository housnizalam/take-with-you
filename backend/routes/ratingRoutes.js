import express from "express";

import {
  createRating,
  getExistingRating,
  getUserRatingSummary,
} from "../repositories/ratingRepository.js";

import {
  getTripCompletionByConversationId,
} from "../repositories/tripCompletionRepository.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      tripId,
      conversationId,
      fromUserId,
      toUserId,
      score,
    } = req.body;

    if (
      !tripId ||
      !conversationId ||
      !fromUserId ||
      !toUserId ||
      score === undefined
    ) {
      return res.status(400).json({
        message: "Missing required rating data",
      });
    }

    const numericScore = Number(score);

    if (
      numericScore < 1 ||
      numericScore > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const completion =
      await getTripCompletionByConversationId(
        conversationId,
      );

    if (
      !completion ||
      !completion.clientConfirmed ||
      !completion.driverConfirmed
    ) {
      return res.status(400).json({
        message:
          "Trip must be completed by both users before rating",
      });
    }

    const isParticipant =
      (
        fromUserId === completion.clientUserId &&
        toUserId === completion.driverUserId
      ) ||
      (
        fromUserId === completion.driverUserId &&
        toUserId === completion.clientUserId
      );

    if (!isParticipant) {
      return res.status(403).json({
        message:
          "Users are not participants in this trip completion",
      });
    }

    const existingRating =
      await getExistingRating(
        tripId,
        fromUserId,
        toUserId,
      );

    if (existingRating) {
      return res.status(409).json({
        message:
          "You already rated this user for this trip",
      });
    }

    const rating = await createRating({
      tripId,
      conversationId,
      fromUserId,
      toUserId,
      score: numericScore,
    });

    res.status(201).json(rating);
  } catch (error) {
    console.error(
      "Error creating rating:",
      error,
    );

    res.status(500).json({
      message: "Could not create rating",
    });
  }
});

router.get(
  "/user/:userId/summary",
  async (req, res) => {
    try {
      const summary =
        await getUserRatingSummary(
          req.params.userId,
        );

      res.status(200).json(summary);
    } catch (error) {
      console.error(
        "Error loading rating summary:",
        error,
      );

      res.status(500).json({
        message:
          "Could not load rating summary",
      });
    }
  },
);

router.get(
  "/trip/:tripId/from/:fromUserId/to/:toUserId",
  async (req, res) => {
    try {
      const rating =
        await getExistingRating(
          req.params.tripId,
          req.params.fromUserId,
          req.params.toUserId,
        );

      res.status(200).json(rating);
    } catch (error) {
      console.error(
        "Error loading rating:",
        error,
      );

      res.status(500).json({
        message: "Could not load rating",
      });
    }
  },
);

export default router;