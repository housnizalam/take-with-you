import { getDatabase } from "../database/couchdb.js";
import queryLimits from "../config/queryLimits.js";

async function createUser(userData) {
  const db = await getDatabase();

  const user = {
    type: "user",
    ...userData,
    createdAt: Date.now(),
  };

  const result = await db.insert(user);

  return {
    ...user,
    _id: result.id,
    _rev: result.rev,
  };
}

async function getUserById(id) {
  const db = await getDatabase();

  const user = await db.get(id);

  return user;
}

async function getAllUsers() {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "user",
    },
    limit: queryLimits.users,
  });

  return result.docs;
}

async function getUserByEmail(email) {
  const db = await getDatabase();

  const result = await db.find({
    selector: {
      type: "user",
      email: email.toLowerCase(),
    },
    limit: 1,
  });

  if (result.docs.length === 0) {
    return null;
  }

  return result.docs[0];
}

export { createUser, getUserById, getAllUsers, getUserByEmail };
