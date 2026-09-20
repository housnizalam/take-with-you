import { getDatabase } from "../database/couchdb.js";

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
    limit: 1000,
  });

  return result.docs.sort(
    (a, b) => a.createdAt - b.createdAt,
  );
}

async function getMessagesByTripId(tripId) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "message",
      tripId,
    },
    limit: 1000,
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
    limit: 1000,
  });

  for (const message of result.docs) {
    await db.destroy(
      message._id,
      message._rev,
    );
  }

  return result.docs.length;
}

export {
  createMessage,
  getMessagesByConversationId,
  getMessagesByTripId,
  deleteMessagesByTripId,
};
