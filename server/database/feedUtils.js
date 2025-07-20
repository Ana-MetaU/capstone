const {getSession} = require("./neo4j");
const neo4j = require("neo4j-driver");
async function getFeed(userId, page, limit) {
  const session = getSession();

  try {
    const offset = parseInt(page - 1) * limit;
    const query = `
  MATCH (currentUser:User {id: $userId})-[:FOLLOWS]->(friend:User)-[w:WATCHED]->(content)
  WHERE content:Movie OR content:TVShow
  MATCH (friend)-[:HAS_PROFILE]->(friendProfile:Profile)

  OPTIONAL MATCH ()-[like:LIKED]->(rel)
  WHERE id(rel) = id(w)
  WITH currentUser, friend, friendProfile, w, content, count(like) as likesCount

  OPTIONAL MATCH ()-[comment:COMMENTED]->(rel)
  WHERE id(rel) = id(w)
  WITH currentUser, friend, friendProfile, w, content, likesCount, count(comment) as commentsCount


  OPTIONAL MATCH (currentUser)-[userLike: LIKED]->(rel)
  WHERE id(rel) = id(w)
  WITH currentUser, friend, friendProfile, w, content, likesCount, commentsCount,
  userLike is NOT NULL as userLiked

  RETURN
    friend.username AS friendUsername,
    friend.id AS friendId,
    friendProfile.profilePicture AS friendProfilePicture,
    w.rating AS rating,
    w.review AS review,
    w.watchedAt AS watchedAt,
    content.title AS contentTitle,
    content.posterPath AS contentPoster,
    content.overview AS contentOverview,
    labels(content)[0] AS contentType,
    likesCount,
    commentsCount,
    userLiked,
    id(w) as watchedId
  ORDER BY w.watchedAt DESC
  SKIP $offset
  LIMIT $limit
`;
    const params = {
      userId,
      offset: neo4j.int(offset),
      limit: neo4j.int(limit),
    };

    const result = await session.run(query, params);

    const feedItems = result.records.map((record) => ({
      friend: {
        id: record.get("friendId"),
        username: record.get("friendUsername"),
        profilePicture: record.get("friendProfilePicture"),
      },
      content: {
        title: record.get("contentTitle"),
        posterPath: record.get("contentPoster"),
        overview: record.get("contentOverview"),
        type: record.get("contentType"),
      },
      rating: {
        rating: record.get("rating"),
        review: record.get("review"),
        watchedAt: record.get("watchedAt"),
      },
      interactions: {
        likesCount: record.get("likesCount").toNumber(),
        commentCount: record.get("commentsCount").toNumber(),
        userLiked: record.get("userLiked"),
      },
    }));

    const hasNextPage = feedItems.length === limit;
    console.log("feed items", feedItems);
    return {
      feedItems,
      hasNextPage,
      currentPage: page,
    };
  } catch (error) {
    console.log("error fetching feed", error);
  } finally {
    await session.close();
  }
}

async function addLike(userId, watchedId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (user: User {id: $userId})
      MATCH (w) WHERE id(w) = $watchedId
      MERGE (user)-[:LIKED {createdAt: datetime()}]->(w)
      `,
      {userId, watchedId: neo4j.int(watchedId)}
    );
    return {
      success: true,
    };
  } finally {
    await session.close();
  }
}

async function removeLike(userId, watchedId) {
  const session = getSession();

  try {
    await session.run(
      `
      MATCH (user: User {id: $userId})-[like: LIKED]->(w)
      WHERE id(w) = $watchedId
      DELETE like
      `,
      {userId, watchedId: neo4j.int(watchedId)}
    );

    return {
      success: true,
    };
  } finally {
    await session.close();
  }
}

async function addComment(userId, watchedId, commentText) {
  const session = getSession();
  try {
    const result = await session.run(
      `
     MATCH (user:User {id: $userId})
     MATCH (w) WHERE id(w) = $watchedId
    MATCH (user)-[:HAS_PROFILE]->(profile)
    
    CREATE (user)-[:COMMENTED {text: $commentText, createdAt: datetime()}]->(w)
  
    RETURN 
    user.id as userId,
    user.username as username,
    profile.profilePicture as profilePicture
      `,
      {userId, watchedId: neo4j.int(watchedId), commentText}
    );
    const record = result.records[0];
    return {
      success: true,
      comment: {
        userId: record.get("userId"),
        username: record.get("username"),
        profilePicture: record.get("profilePicture"),
        text: commentText,
        createdAt: new Date().toISOString(),
      },
    };
  } finally {
    await session.close();
  }
}

async function getComments(watchedId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (w) WHERE id(w) = $watchedId
      MATCH (user)-[comment: COMMENTED]-> (w)
      MATCH (user)-[:HAS_PROFILE]->(profile)

      RETURN 
      user.id as userId,
      user.name as username,
      profile.profilePicture as profilePicture,
      comment.text as text,
      comment.createdAt as createdAt
      ORDER BY comment.createdAt ASC
      `,
      {watchedId: neo4j.int(watchedId)}
    );

    return result.records.map((record) => ({
      userId: record.get("userId"),
      username: record.get("username"),
      profilePicture: record.get("profilePicture"),
      text: record.get("text"),
      createdAt: record.get("createdAt"),
    }));
  } finally {
    await session.close();
  }
}

async function getLikesCount(watchedId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (w) WHERE id(w) = $watchedId
      OPTIONAL MATCH (w)<-[:LIKED]-(user)
      RETURN count(user) as likesCount
      `,
      {watchedId: neo4j.int(watchedId)}
    );

    return result.records[0].get("likesCount").toNumber();
  } finally {
    await session.close();
  }
}

async function hasUserLiked(userId, watchedId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (user: User {id: $userId})
      MATCH (w) WHERE id(w) = $watchedId
      RETURN exists((user)-[:LIKED]->(w)) as hasLiked
      `,
      {userId, watchedId: neo4j.int(watchedId)}
    );

    return result.records[0].get("hasLiked");
  } finally {
    await session.close();
  }
}
module.exports = {
  getFeed,
  addLike,
  removeLike,
  hasUserLiked,
  getLikesCount,
  addComment,
  getComments,
};
