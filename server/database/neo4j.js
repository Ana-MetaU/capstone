//https://neo4j.com/docs/javascript-manual/current/connect/
// https://www.youtube.com/watch?v=IShRYPsmiR8

const neo4j = require("neo4j-driver");
require("dotenv").config();
let driver;
const connectDB = async () => {
  const URI = process.env.NEO4J_URI;
  const USER = process.env.NEO4J_USERNAME;
  const PASSWORD = process.env.NEO4J_PASSWORD;
  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();

    console.log("database is connected");
    console.log("here is the server info: ", serverInfo);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    throw err;
  }
};

const getSession = () => {
  if (!driver) {
    console.log("Initilaize a connection first");
  }
  return driver.session();
};

const closeDriver = async () => {
  await driver.close();
  console.log("database connection is closed;");
};

module.exports = {connectDB, getSession, closeDriver};
