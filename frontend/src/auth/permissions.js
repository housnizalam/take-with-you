function isTripOwner(trip, user) {
  return trip.ownerId === user.id;
}

export { isTripOwner };