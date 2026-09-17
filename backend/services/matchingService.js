import { calculateDistanceKm } from "./distanceService.js";

function isTripMatch(trip, need) {
  const isDateMatch =
    trip.date >= need.dateFrom &&
    trip.date <= need.dateTo;

  const distanceKm = calculateDistanceKm(
    need.fromLat,
    need.fromLng,
    trip.fromLat,
    trip.fromLng
  );

  const isLocationMatch =
    distanceKm <= need.fromRadiusKm;

  const hasEnoughSeats =
    trip.availableSeats >= need.requiredSeats;

  const hasEnoughBoxes =
    trip.availableBoxes >= need.requiredBoxes;

  return (
    isDateMatch &&
    isLocationMatch &&
    hasEnoughSeats &&
    hasEnoughBoxes
  );
}

export { isTripMatch };