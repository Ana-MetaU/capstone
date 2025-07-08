// https://neo4j.com/docs/api/python-driver/current/api.html#neo4jdriver
// https://neo4j.com/docs/javascript-manual/5/query-advanced/
const bcrypt = require("bcrypt");
const {getSession} = require("./neo4j");
const {USER_NOT_FOUND, RESULT_INDEX} = require("./constants.js");
//
//Creates a new user in teh database
// Params: userData ({username, passwordHash, email})
// Returns: created user object
//
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
    const userNode = result.records[RESULT_INDEX].get("u").properties;
    const createdUser = userNode;
    return createUser;
  } finally {
    await session.close();
  }
};

// Checks if the user exists by username or email
// Params: username (string), email(string)
// Returns boolean (true if exists, false otherwise)
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

    user = result.records.length > 0;
    return user;
  } finally {
    await session.close();
  }
};

// Finds a usr by various search ways (email, id, username)
// params: query (string), params(object)
// Returns user or USER_NOT_FOUND
const findUser = async (query, params) => {
  const session = getSession();
  try {
    const result = await session.run(query, params);

    if (!result.records.length) {
      return USER_NOT_FOUND;
    }

    const userNode = result.records[RESULT_INDEX].get("u").properties;
    return userNode;
  } catch (error) {
    console.log("database failed", error);
  } finally {
    await session.close();
  }
};

// Gets user by username (uses findUser)
// params: username(string)
// Returns: user object or USER_NOT_FOUND
const getUserByUsername = async (username) => {
  const query = `MATCH (u:User)
      WHERE u.username = $username
      RETURN u`;
  return await findUser(query, {username});
};

// Gets user by id (uses findUser)
// params: id(number)
// Returns: user object or USER_NOT_FOUND
const getUserById = async (id) => {
  const query = `MATCH (u:User)
      WHERE u.id = $id
      RETURN u`;

  return await findUser(query, {id});
};

// Verfies user password against the hashed passwordstored in database
// params: username (string), password (string)
// Returns: boolean (true if valid and false if invalid)
const verifyUserPassword = async (username, password) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u:User)
    WHERE u.username = $username
    RETURN u`,
      {username}
    );

    const records = result.records.length;
    if (!records) {
      return USER_NOT_FOUND;
    }
    const userPassword =
      result.records[RESULT_INDEX].get("u").properties.passwordHash;
    const isValid = await bcrypt.compare(password, userPassword);

    return isValid;
  } catch (error) {
    console.log("database failed", error);
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
