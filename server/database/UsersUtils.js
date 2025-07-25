const {getSession} = require("./neo4j");

async function searchUserByUsername(searchQuery) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u:User)-[:HAS_PROFILE]-> (p: Profile)
      WHERE toLower(u.username) CONTAINS $searchQuery
      RETURN u.id as userId,
      u.username as username,
      p{
      .id,
      .bio,
      .privacyLevel,
      .profilePicture,
      .favoriteGenres
      } as profile
      ORDER BY u.username
      LIMIT 25
      `,
      {searchQuery}
    );

    return result.records.map((record) => {
      const profile = record.get("profile");
      return {
        userId: record.get("userId"),
        username: record.get("username"),
        profileId: profile.id,
        bio: profile.bio,
        privacyLevel: profile.privacyLevel,
        profilePicture: profile.profilePicture,
        favoriteGenres: profile.favoriteGenres,
      };
    });
  } finally {
    await session.close();
  }
}

async function getUserProfileByUsername(username) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u:User {username: $username})-[:HAS_PROFILE]->(p: Profile)
      RETURN u.id as userId,
      u.username as username,
      p{
      .id,
      .bio,
      .privacyLevel,
      .profilePicture,
      .favoriteGenres,
      .createdAt,
      .updatedAt
      } as profile
      `,
      {username}
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    const profile = record.get("profile");

    return {
      userId: record.get("userId"),
      username: record.get("username"),
      id: profile.id,
      bio: profile.bio,
      privacyLevel: profile.privacyLevel,
      profilePicture: profile.profilePicture,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } finally {
    await session.close();
  }
}

// Get user profile
async function getUserStats(userId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
  MATCH (u:User {id: $userId})
OPTIONAL MATCH (u)-[:WATCHED]->(m:Movie)
OPTIONAL MATCH (u)-[:WATCHED]->(s:TVShow)
OPTIONAL MATCH (u)-[:FOLLOWS]->(following:User)   // users u follows
OPTIONAL MATCH (follower:User)-[:FOLLOWS]->(u)   // users who follow u
RETURN count(DISTINCT m) AS MovieCount, 
       count(DISTINCT s) AS TvShowCount, 
       count(DISTINCT following) AS Following, 
       count(DISTINCT follower) AS Followers
`,
      {userId}
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("database error");
    }
    const record = result.records[0];
    const movieCount = record.get("MovieCount").toNumber();
    const TvShowCount = record.get("TvShowCount").toNumber();
    const Followers = record.get("Followers").toNumber();
    const Following = record.get("Following").toNumber();

    return {
      movieCount: movieCount,
      TvShowCount: TvShowCount,
      Followers: Followers,
      Following: Following,
    };
  } finally {
    await session.close();
  }
}

module.exports = {
  getUserStats,
  getUserProfileByUsername,
  searchUserByUsername,
};
