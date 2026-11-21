// Database connection settings are provided via environment variables.
// Never commit actual database usernames or passwords.
const required = ["COUCHDB_USERNAME", "COUCHDB_PASSWORD"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missing.join(", ")}. See .env.example and README.md.`,
  );
}

const databaseConfig = {
  protocol: process.env.COUCHDB_PROTOCOL || "http",
  host: process.env.COUCHDB_HOST || "127.0.0.1",
  port: Number(process.env.COUCHDB_PORT || "5984"),
  username: process.env.COUCHDB_USERNAME,
  password: process.env.COUCHDB_PASSWORD,
  databaseName: process.env.COUCHDB_DATABASE || "take_with_you",
};

export default databaseConfig;
