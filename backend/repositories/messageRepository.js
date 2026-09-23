import { getDatabase } from "../database/couchdb.js";
import queryLimits from "../config/queryLimits.js";

async function createMessage(messageData) {
  const db = await getDatabase();

  const message = {
    type: "message",
    ...messageData,
    createdAt: Date.now(),
  };

  const result = await db.insert(message);

  return {
    ...message,
    _id: result.id,
    _rev: result.rev,
  };
}

async function getMessagesByConversationId(conversationId) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "message",
      conversationId,
    },
    limit: queryLimits.messagesPerConversation,
  });

  return result.docs.sort((a, b) => a.createdAt - b.createdAt);
}

async function getMessagesByTripId(tripId) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "message",
      tripId,
    },
    limit: queryLimits.messagesPerTrip,
  });

  return result.docs;
}

async function deleteMessagesByTripId(tripId) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "message",
      tripId,
    },
    limit: queryLimits.messagesPerTrip,
  });

  for (const message of result.docs) {
    await db.destroy(message._id, message._rev);
  }

  return result.docs.length;
}

export {
  createMessage,
  getMessagesByConversationId,
  getMessagesByTripId,
  deleteMessagesByTripId,
};
