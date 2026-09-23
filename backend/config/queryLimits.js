

const queryLimits = {
  // Users
  users: 10000,

  // Active trips / matching pool
  trips: 50000,

  // Active transport requests
  needs: 50000,

  // One conversation can realistically become long,
  messagesPerConversation: 500,

  // Driver may have several conversations on one trip
  messagesPerTrip: 500,

  // Usually one completion document per conversation
  tripCompletions: 10000,

  // User reputation should preserve a large history
  ratingsPerUser: 10000,

  // Cleanup should work in batches, NOT load everything at once
  cleanupTrips: 5000,
  cleanupNeeds: 5000,
};

export default queryLimits;