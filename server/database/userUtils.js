// https://neo4j.com/docs/api/python-driver/current/api.html#neo4jdriver
// https://neo4j.com/docs/javascript-manual/5/query-advanced/
const bcrypt = require("bcrypt");
const {getSession} = require("./neo4j");

const createUser = async (userData) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            CREATE (u:User {
                id: randomUUID(),
                username: $username,
                passwordHash: $passwordHash,
                email: $email,
                createdAt: datetime()
           })
            RETURN u
            `,
      userData
    );
    const createdUser = result.records[0].get("u").properties;
    console.log("user created", createUser);
    return createUser;
  } finally {
    await session.close();
  }
};

const checkUserExists = async (username, email) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User) 
                WHERE u.username = $username OR u.email = $email
                RETURN u`,
      {username, email}
    );
    console.log("omog", result);
    return result.records.length > 0;
  } finally {
    await session.close();
  }
};

// Will refactor this function to just be a findUser that you can pass id or username
const getUserByUsername = async (username) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u:User)
      WHERE u.username = $username
      RETURN u`,
      {username}
    );
    if (!result.records.length) {
      return 0;
    }

    return result.records[0].get("u").properties;
  } finally {
    await session.close();
  }
};

const getUserById = async (id) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u:User)
      WHERE u.id = $id
      RETURN u`,
      {id}
    );
    if (!result.records.length) {
      return 0;
    }

    return result.records[0].get("u").properties;
  } finally {
    await session.close();
  }
};

const verifyUserPassword = async (username, password) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u:User)
    WHERE u.username = $username
    RETURN u`,
      {username}
    );
    const userPassword = result.records[0].get("u").properties.passwordHash;

    return await bcrypt.compare(password, userPassword);
  } finally {
    await session.close();
  }
};

module.exports = {
  createUser,
  checkUserExists,
  getUserByUsername,
  verifyUserPassword,
  getUserById,
};
