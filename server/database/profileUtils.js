const {getSession} = require("./neo4j");

// Get user profile
async function getUserProfile(userId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_PROFILE]->(p:Profile)
      RETURN u.username as username,
             p {
               .id,
               .bio,
               .isPublic,
               .profilePicture,
               .favoriteGenres,
               .createdAt,
               .updatedAt
             } as profile
      `,
      {userId}
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("User profile not found");
    }

    const record = result.records[0];
    const profile = record.get("profile");
    return {
      userId,
      username: record.get("username"),
      id: profile.id,
      bio: profile.bio,
      isPublic: profile.isPublic,
      profilePicture: profile.profilePicture,
      favoriteGenres: profile.favoriteGenres,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } finally {
    await session.close();
  }
}

// Create a new profile for a user
async function createUserProfile(userId, profileData) {
  const session = getSession();
  try {
    const bio = profileData.bio || "";
    const isPublic = true;
    const profilePicture = profileData.profilePicture || null;
    const favoriteGenres = profileData.favoriteGenres || [];

    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (p:Profile {
        id: randomUUID(),
        bio: $bio,
        isPublic: $isPublic,
        profilePicture: $profilePicture,
        favoriteGenres: $favoriteGenres,
        createdAt: datetime(),
        updatedAt: datetime()
      })
      CREATE (u)-[:HAS_PROFILE]->(p)
      RETURN u.username as username,
             p {
               .id,
               .bio,
               .isPublic,
               .profilePicture,
               .favoriteGenres,
               .createdAt,
               .updatedAt
             } as profile
      `,
      {
        userId,
        bio,
        isPublic,
        profilePicture,
        favoriteGenres,
      }
    );

    const records = result.records.length;

    if (!records) {
      throw new Error("User does not exist. Create account or log in.");
    }

    const record = result.records[0];
    const profile = record.get("profile");
    return {
      userId,
      username: record.get("username"),
      id: profile.id,
      bio: profile.bio,
      isPublic: profile.isPublic,
      profilePicture: profile.profilePicture,
      favoriteGenres: profile.favoriteGenres,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } finally {
    await session.close();
  }
}
// Update user profile
async function updateUserProfile(userId, profileData) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_PROFILE]->(p:Profile)
      SET p.bio = CASE WHEN $bio IS NOT NULL THEN $bio ELSE p.bio END,
          p.isPublic = CASE WHEN $isPublic IS NOT NULL THEN $isPublic ELSE p.isPublic END, 
          p.profilePicture = CASE WHEN $profilePicture IS NOT NULL THEN $profilePicture ELSE p.profilePicture END,
          p.favoriteGenres = CASE WHEN $favoriteGenres IS NOT NULL THEN $favoriteGenres ELSE p.favoriteGenres END,
          p.updatedAt = datetime()
      RETURN u.username as username,
             p {
               .id,
               .bio,
               .isPublic,
               .profilePicture,
               .favoriteGenres,
               .createdAt,
               .updatedAt
             } as profile
      `,
      {
        userId,
        bio: profileData.bio,
        isPublic: profileData.isPublic,
        profilePicture: profileData.profilePicture,
        favoriteGenres: profileData.favoriteGenres,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("User profile not found");
    }

    const record = result.records[0];
    const profile = record.get("profile");
    console.log("profile", profile);

    return {
      userId,
      username: record.get("username"),
      id: profile.id,
      bio: profile.bio,
      isPublic: profile.isPublic,
      profilePicture: profile.profilePicture,
      favoriteGenres: profile.favoriteGenres,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  } finally {
    await session.close();
  }
}
// check if user has a profile
async function userHasProfile(userId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $userId})-[:HAS_PROFILE]->(p:Profile)
      RETURN count(p) > 0 as hasProfile
      `,
      {userId}
    );

    hasProfile =
      result.records.length > 0 && result.records[0].get("hasProfile");
    return hasProfile;
  } finally {
    await session.close();
  }
}

module.exports = {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  userHasProfile,
};
