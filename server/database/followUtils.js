const {getSession} = require("./neo4j");

// Create a follows relationship
async function createFollowRelationship(followerId, followeeId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (follower:User {id: $followerId})
      MATCH (followee:User {id: $followeeId})
      MERGE (follower)-[:FOLLOWS]->(followee)
      RETURN follower.username as follower, followee.username as followee
      `,
      {followerId, followeeId}
    );

    if (result.records.length === 0) {
      throw new Error("One or both users not found in Neo4j");
    }

    const record = result.records[0];
    return true;
  } finally {
    await session.close();
  }
}

// Remove follows relationship
async function removeFollowRelationship(followerId, followeeId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (follower:User {id: $followerId})-[r:FOLLOWS]->(followee:User {id: $followeeId})
      DELETE r
      RETURN count(r) as deletedCount
      `,
      {followerId, followeeId}
    );

    const deletedCount = result.records[0]?.get("deletedCount") || 0;
    return deletedCount > 0;
  } finally {
    await session.close();
  }
}

// Check if user A follows user B
async function isFollowing(followerId, followeeId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (follower:User {id: $followerId})-[:FOLLOWS]->(followee:User {id: $followeeId})
      RETURN count(*) > 0 as isFollowing
      `,
      {followerId, followeeId}
    );

    const isFollowing =
      result.records.length > 0 && result.records[0].get("isFollowing");
    return isFollowing;
  } finally {
    await session.close();
  }
}

// Get users that a user is following
async function getFollowing(userId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (user:User {id: $userId})-[:FOLLOWS]->(following:User)
      RETURN following {
        .id,
        .username
      } as following
      ORDER BY following.username
      `,
      {userId}
    );

    return result.records.map((record) => record.get("following"));
  } finally {
    await session.close();
  }
}

// Get users that follow a user
async function getFollowers(userId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (follower:User)-[:FOLLOWS]->(user:User {id: $userId})
      RETURN follower {
        .id,
        .username
      } as follower
      ORDER BY follower.username
      `,
      {userId}
    );

    return result.records.map((record) => record.get("follower"));
  } finally {
    await session.close();
  }
}

module.exports = {
  createFollowRelationship,
  removeFollowRelationship,
  isFollowing,
  getFollowing,
  getFollowers,
};
