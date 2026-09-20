import express from "express";

import {
  createMessage,
  getMessagesByConversationId,
  getMessagesByTripId,
} from "../repositories/messageRepository.js";

import { getUserById } from "../repositories/userRepository.js";

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

router.get(
  "/trip/:tripId/user/:userId/conversations",
  async (req, res) => {
    try {
      const { tripId, userId } = req.params;

      const messages =
        await getMessagesByTripId(tripId);

      const userMessages = messages.filter(
        (message) =>
          message.fromUserId === userId ||
          message.toUserId === userId,
      );

      const conversationsMap = new Map();

      for (const message of userMessages) {
        const existing =
          conversationsMap.get(
            message.conversationId,
          );

        if (
          !existing ||
          message.createdAt >
            existing.lastMessageAt
        ) {
          const otherUserId =
            message.fromUserId === userId
              ? message.toUserId
              : message.fromUserId;

          conversationsMap.set(
            message.conversationId,
            {
              conversationId:
                message.conversationId,

              otherUserId,

              lastMessage:
                message.text,

              lastMessageAt:
                message.createdAt,
            },
          );
        }
      }

      const conversations = [];

      for (const conversation of
        conversationsMap.values()) {
        const otherUser =
          await getUserById(
            conversation.otherUserId,
          );

        conversations.push({
          ...conversation,
          otherUserName: otherUser.name,
        });
      }

      conversations.sort(
        (a, b) =>
          b.lastMessageAt -
          a.lastMessageAt,
      );

      res.status(200).json(conversations);
    } catch (error) {
      console.error(
        "Error loading conversations:",
        error,
      );

      res.status(500).json({
        message:
          "Could not load conversations",
      });
    }
  },
);

export default router;