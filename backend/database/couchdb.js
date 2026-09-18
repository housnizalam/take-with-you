import nano from "nano";
import databaseConfig from "../config/databaseConfig.js";

const {
  protocol,
  host,
  port,
  username,
  password,
  databaseName
} = databaseConfig;

const couchDbUrl =
  `${protocol}://${username}:${password}@${host}:${port}`;

const couch = nano(couchDbUrl);

async function getDatabase() {
  const databases = await couch.db.list();

  if (!databases.includes(databaseName)) {
    await couch.db.create(databaseName);
    console.log(`Database "${databaseName}" created`);
  }

  return couch.db.use(databaseName);
}

async function createIndexes() {
  const db = await getDatabase();

  await db.createIndex({
    index: {
      fields: ["type", "date"]
    },
    name: "trip-date-index",
    type: "json"
  });
}

export { getDatabase, createIndexes };