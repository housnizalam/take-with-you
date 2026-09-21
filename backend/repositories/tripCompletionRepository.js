

import { getDatabase } from "../database/couchdb.js";

async function createTripCompletion(completionData) {
  const db = await getDatabase();

  const completion = {
    type: "trip_completion",

    tripId: completionData.tripId,
    conversationId: completionData.conversationId,

    clientUserId: completionData.clientUserId,
    driverUserId: completionData.driverUserId,

    clientConfirmed: false,
    driverConfirmed: false,

    completedAt: null,
    createdAt: Date.now(),
  };

  const result = await db.insert(completion);

  return {
    ...completion,
    _id: result.id,
    _rev: result.rev,
  };
}

async function getTripCompletionByConversationId(
  conversationId,
) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "trip_completion",
      conversationId,
    },
    limit: 1,
  });

  if (result.docs.length === 0) {
    return null;
  }

  return result.docs[0];
}

async function confirmTripCompletion(
  conversationId,
  userId,
) {
  const db = await getDatabase();

  const completion =
    await getTripCompletionByConversationId(
      conversationId,
    );

  if (!completion) {
    throw new Error("Trip completion not found");
  }

  if (userId === completion.clientUserId) {
    completion.clientConfirmed = true;
  } else if (userId === completion.driverUserId) {
    completion.driverConfirmed = true;
  } else {
    throw new Error(
      "User is not part of this trip completion",
    );
  }

  if (
    completion.clientConfirmed &&
    completion.driverConfirmed
  ) {
    completion.completedAt = Date.now();
  }

  const result = await db.insert(completion);

  return {
    ...completion,
    _rev: result.rev,
  };
}

async function deleteTripCompletionsByTripId(tripId) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "trip_completion",
      tripId,
    },
    limit: 1000,
  });

  for (const completion of result.docs) {
    await db.destroy(
      completion._id,
      completion._rev,
    );
  }

  return result.docs.length;
}

export {
  createTripCompletion,
  getTripCompletionByConversationId,
  confirmTripCompletion,
  deleteTripCompletionsByTripId,
};