import { deleteExpiredTrips } from "../repositories/tripRepository.js";
import { deleteExpiredNeeds } from "../repositories/needRepository.js";
import { deleteMessagesByTripId } from "../repositories/messageRepository.js";
import { deleteTripCompletionsByTripId } from "../repositories/tripCompletionRepository.js";

function getCutoffDate() {
  const date = new Date();

  date.setDate(date.getDate() - 3);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function cleanupExpiredData() {
  try {
    const cutoffDate = getCutoffDate();

    const deletedTripIds = await deleteExpiredTrips(cutoffDate);

    for (const tripId of deletedTripIds) {
      await deleteMessagesByTripId(tripId);

      await deleteTripCompletionsByTripId(tripId);
    }

    const deletedNeeds = await deleteExpiredNeeds(cutoffDate);

    console.log(
      `Cleanup finished. Cutoff: ${cutoffDate}, ` +
        `Trips deleted: ${deletedTripIds.length}, ` +
        `Needs deleted: ${deletedNeeds}`,
    );
  } catch (error) {
    console.error("Error cleaning expired data:", error);
  }
}

export { cleanupExpiredData };
