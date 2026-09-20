
function createConversationId(tripId, userId1, userId2) {
  const sortedUserIds = [userId1, userId2].sort();

  return `${tripId}_${sortedUserIds[0]}_${sortedUserIds[1]}`;
}

export { createConversationId };