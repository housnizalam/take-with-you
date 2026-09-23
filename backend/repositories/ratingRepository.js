import { getDatabase } from "../database/couchdb.js";
import queryLimits from "../config/queryLimits.js";

async function createRating(ratingData) {
  const db = await getDatabase();

  const rating = {
    type: "rating",

    tripId: ratingData.tripId,
    conversationId: ratingData.conversationId,

    fromUserId: ratingData.fromUserId,
    toUserId: ratingData.toUserId,

    score: ratingData.score,

    createdAt: Date.now(),
  };

  const result = await db.insert(rating);

  return {
    ...rating,
    _id: result.id,
    _rev: result.rev,
  };
}

async function getExistingRating(
  tripId,
  fromUserId,
  toUserId,
) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "rating",
      tripId,
      fromUserId,
      toUserId,
    },
    limit: 1,
  });

  if (result.docs.length === 0) {
    return null;
  }

  return result.docs[0];
}

async function getRatingsForUser(userId) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "rating",
      toUserId: userId,
    },
limit: queryLimits.ratingsPerUser,
  });

  return result.docs;
}

async function getUserRatingSummary(userId) {
  const ratings = await getRatingsForUser(userId);

  if (ratings.length === 0) {
    return {
      averageRating: 0,
      ratingCount: 0,
    };
  }

  const total = ratings.reduce(
    (sum, rating) => sum + rating.score,
    0,
  );

  return {
    averageRating: total / ratings.length,
    ratingCount: ratings.length,
  };
}

export {
  createRating,
  getExistingRating,
  getRatingsForUser,
  getUserRatingSummary,
};