function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const EARTH_RADIUS_KM = 6371;

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return EARTH_RADIUS_KM * c;
}

export { calculateDistanceKm };