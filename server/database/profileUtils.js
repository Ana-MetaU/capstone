const {isPath} = require("neo4j-driver");
const {getSession} = require("./neo4j");
const PRIVACY_TIERS = ["friends_only", "friends_of_friends", "public"];
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
               .privacyLevel,
               .profilePicture,
               .favoriteGenres,
               .createdAt,
               .updatedAt
             } as profile
      `,
      {userId}
    );

    const records = result.records.length;
    console.log("what is the length of records", records);
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
      privacyLevel: profile.privacyLevel,
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
    const privacyLevel = profileData.privacyLevel || "public";
    const profilePicture = profileData.profilePicture || null;
    const favoriteGenres = profileData.favoriteGenres || [];

    const result = await session.run(
      `
      MATCH (u:User {id: $userId})
      CREATE (p:Profile {
        id: randomUUID(),
        bio: $bio,
        privacyLevel: $privacyLevel,
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
               .privacyLevel,
               .profilePicture,
               .favoriteGenres,
               .createdAt,
               .updatedAt
             } as profile
      `,
      {
        userId,
        bio,
        privacyLevel,
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
      privacyLevel: profile.privacyLevel,
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
          p.privacyLevel = CASE WHEN $privacyLevel IS NOT NULL THEN $privacyLevel ELSE p.privacyLevel END, 
          p.profilePicture = CASE WHEN $profilePicture IS NOT NULL THEN $profilePicture ELSE p.profilePicture END,
          p.favoriteGenres = CASE WHEN $favoriteGenres IS NOT NULL THEN $favoriteGenres ELSE p.favoriteGenres END,
          p.updatedAt = datetime()
      RETURN u.username as username,
             p {
               .id,
               .bio,
               .privacyLevel,
               .profilePicture,
               .favoriteGenres,
               .createdAt,
               .updatedAt
             } as profile
      `,
      {
        userId,
        bio: profileData.bio,
        privacyLevel: profileData.privacyLevel,
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
      privacyLevel: profile.privacyLevel,
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

   const hasProfile =
      result.records.length > 0 && result.records[0].get("hasProfile");
    return hasProfile;
  } finally {
    await session.close();
  }
}

async function getProfilePrivacy(userId) {
  try {
    const profile = await getUserProfile(userId);
    return {
      privacyLevel: profile.privacyLevel,
    };
  } catch (error) {
    console.log("error getting profile privacy settings", error);
    return false;
  }
}

module.exports = {
  getUserProfile,
  getProfilePrivacy,
  createUserProfile,
  updateUserProfile,
  userHasProfile,
  PRIVACY_TIERS
};
