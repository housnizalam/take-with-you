import { calculateDistanceKm } from "./distanceService.js";

const MAX_DESTINATION_DISTANCE_KM = 50;

function isTripMatch(trip, need) {
  const isDateMatch = trip.date >= need.dateFrom && trip.date <= need.dateTo;

  const distanceKm = calculateDistanceKm(
    need.fromLat,
    need.fromLng,
    trip.fromLat,
    trip.fromLng,
  );

  const isLocationMatch = distanceKm <= need.fromRadiusKm;

  const hasEnoughSeats = trip.availableSeats >= need.requiredSeats;

  const hasEnoughBoxes = trip.availableBoxes >= need.requiredBoxes;

  return isDateMatch && isLocationMatch && hasEnoughSeats && hasEnoughBoxes;
}

function findMatchingTrips(trips, need) {
  return trips
    .filter((trip) => isTripMatch(trip, need))

    .map((trip) => {
      const destinationDistanceKm = calculateDistanceKm(
        need.toLat,
        need.toLng,
        trip.toLat,
        trip.toLng
      );

      return {
        ...trip,
        destinationDistanceKm
      };
    })

    .filter(
      (trip) =>
        trip.destinationDistanceKm <=
        MAX_DESTINATION_DISTANCE_KM
    )

    .sort(
      (a, b) =>
        a.destinationDistanceKm -
        b.destinationDistanceKm
    );
}

export { isTripMatch, findMatchingTrips };
