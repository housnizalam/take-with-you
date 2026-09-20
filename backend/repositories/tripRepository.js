import { getDatabase } from "../database/couchdb.js";

async function createTrip(tripData) {
  const db = await getDatabase();

  const trip = {
    type: "trip",
    ...tripData,
    createdAt: Date.now(),
  };

  const result = await db.insert(trip);

  return {
    ...trip,
    _id: result.id,
    _rev: result.rev,
  };
}

async function getAllTrips() {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "trip",
    },
    limit: 1000,
  });

  return result.docs;
}

async function getTripById(id) {
  const db = await getDatabase();

  console.log("Repository ID:", id);

  const trip = await db.get(id);

  return trip;
}

async function updateTrip(id, tripData) {
  const db = await getDatabase();

  const existingTrip = await db.get(id);

  const updatedTrip = {
    ...existingTrip,
    ...tripData,
    _id: existingTrip._id,
    _rev: existingTrip._rev,
    type: "trip",
  };

  const result = await db.insert(updatedTrip);

  return {
    ...updatedTrip,
    _rev: result.rev,
  };
}

async function deleteTrip(id) {
  const db = await getDatabase();

  const existingTrip = await db.get(id);

  const result = await db.destroy(existingTrip._id, existingTrip._rev);

  return result;
}

async function getTripsByDateRange(dateFrom, dateTo) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "trip",
      date: {
        $gte: dateFrom,
        $lte: dateTo,
      },
    },
  });

  return result.docs;
}

async function deleteExpiredTrips(cutoffDate) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "trip",
      date: {
        $lte: cutoffDate,
      },
    },
    limit: 1000,
  });

  const deletedTripIds = [];

  for (const trip of result.docs) {
    await db.destroy(trip._id, trip._rev);

    deletedTripIds.push(trip._id);
  }

  return deletedTripIds;
}

export {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripsByDateRange,
  deleteExpiredTrips,
};
