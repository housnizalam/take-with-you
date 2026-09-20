import express from "express";

import {
  createMessage,
  getMessagesByConversationId,
} from "../repositories/messageRepository.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      conversationId,
      tripId,
      fromUserId,
      toUserId,
      text,
    } = req.body;

    if (
      !conversationId ||
      !tripId ||
      !fromUserId ||
      !toUserId ||
      !text
    ) {
      return res.status(400).json({
        message: "Missing required message data",
      });
    }

    const message = await createMessage({
      conversationId,
      tripId,
      fromUserId,
      toUserId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);

    res.status(500).json({
      message: "Could not create message",
    });
  }
});

router.get("/conversation/:conversationId", async (req, res) => {
  try {
    const messages =
      await getMessagesByConversationId(
        req.params.conversationId,
      );

    res.status(200).json(messages);
  } catch (error) {
    console.error(
      "Error loading messages:",
      error,
    );

    res.status(500).json({
      message: "Could not load messages",
    });
  }
});

export default router;