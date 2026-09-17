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
    type: "trip"
  };

  const result = await db.insert(updatedTrip);

  return {
    ...updatedTrip,
    _rev: result.rev
  };
}

async function deleteTrip(id) {
  const db = await getDatabase();

  const existingTrip = await db.get(id);

  const result = await db.destroy(
    existingTrip._id,
    existingTrip._rev
  );

  return result;
}

export { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip };
