import { getDatabase } from "../database/couchdb.js";
import queryLimits from "../config/queryLimits.js";

async function createNeed(needData) {
  const db = await getDatabase();

  const need = {
    type: "need",
    ...needData,
    createdAt: Date.now(),
  };

  const result = await db.insert(need);

  return {
    ...need,
    _id: result.id,
    _rev: result.rev,
  };
}

async function getAllNeeds() {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "need",
    },
    limit: queryLimits.needs,
  });

  return result.docs;
}

async function getNeedById(id) {
  const db = await getDatabase();

  const need = await db.get(id);

  return need;
}

async function updateNeed(id, needData) {
  const db = await getDatabase();

  const existingNeed = await db.get(id);

  const updatedNeed = {
    ...existingNeed,
    ...needData,
    _id: existingNeed._id,
    _rev: existingNeed._rev,
    type: "need",
  };

  const result = await db.insert(updatedNeed);

  return {
    ...updatedNeed,
    _rev: result.rev,
  };
}

async function deleteNeed(id) {
  const db = await getDatabase();

  const existingNeed = await db.get(id);

  const result = await db.destroy(existingNeed._id, existingNeed._rev);

  return result;
}

async function deleteExpiredNeeds(cutoffDate) {
  const db = await getDatabase();

  let deletedCount = 0;

  while (true) {
    const result = await db.find({
      selector: {
        type: "need",
        dateTo: {
          $lte: cutoffDate,
        },
      },
      limit: queryLimits.cleanupNeeds,
    });

    if (result.docs.length === 0) {
      break;
    }

    for (const need of result.docs) {
      await db.destroy(need._id, need._rev);

      deletedCount++;
    }

    if (result.docs.length < queryLimits.cleanupNeeds) {
      break;
    }
  }

  return deletedCount;
}

export {
  createNeed,
  getAllNeeds,
  getNeedById,
  updateNeed,
  deleteNeed,
  deleteExpiredNeeds,
};
