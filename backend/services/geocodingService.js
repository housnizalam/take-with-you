

async function geocodeLocation(locationName) {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(locationName)}` +
    `&format=jsonv2` +
    `&limit=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "TakeWithYou/1.0"
    }
  });

  if (!response.ok) {
    throw new Error("Geocoding request failed");
  }

  const results = await response.json();

  if (results.length === 0) {
    throw new Error(`Location not found: ${locationName}`);
  }

  return {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
    displayName: results[0].display_name
  };
}

export { geocodeLocation };