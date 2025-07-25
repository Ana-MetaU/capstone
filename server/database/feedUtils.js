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
    size(coalesce(w.likedBy,[])) as likesCount,
    size(coalesce(w.commentTexts, [])) as commentsCount,
    $userId IN coalesce(w.likedBy, []) as userLiked,
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
      watchedId: record.get("watchedId").toString(),
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
        watchedAt: record.get("watchedAt").toString(),
      },
      interactions: {
        likesCount: record.get("likesCount").toNumber(),
        commentCount: record.get("commentsCount").toNumber(),
        userLiked: record.get("userLiked"),
      },
    }));

    const hasNextPage = feedItems.length === limit;
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
    const result = await session.run(
      `
     MATCH ()-[w:WATCHED]->() WHERE id(w) = $watchedId
      SET w.likedBy = CASE
      WHEN w.likedBy is NULL THEN [$userId]
      WHEN NOT ($userId IN w.likedBy) THEN w.likedBy + [$userId]
      ELSE w.likedBy
      END
      RETURN w.likedBy as newLikes, size(w.likedBy) as newCount
      `,
      {watchedId: neo4j.int(watchedId), userId}
    );

    const record = result.records[0];

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
      MATCH ()-[w:WATCHED]->() WHERE id(w)= $watchedId
      SET w.likedBy = [user IN w.likedBy WHERE user <> $userId]
      `,
      {watchedId: neo4j.int(watchedId), userId}
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
MATCH (user:User {id: $userId})-[:HAS_PROFILE]->(profile)
MATCH ()-[w:WATCHED]->()
WHERE id(w) = $watchedId

WITH user, profile, w, 
     $commentText AS newText, 
     $userId AS newUserId,
     user.username AS newUsername,
     COALESCE(profile.profilePicture, "") AS newProfilePic,
     toString(datetime()) AS newCreatedAt

SET w.commentTexts = CASE
  WHEN w.commentTexts IS NULL THEN [newText]
  ELSE w.commentTexts + [newText]
END,
w.commentUserIds = CASE
  WHEN w.commentUserIds IS NULL THEN [newUserId]
  ELSE w.commentUserIds + [newUserId]
END,
w.commentUsernames = CASE
  WHEN w.commentUsernames IS NULL THEN [newUsername]
  ELSE w.commentUsernames + [newUsername]
END,
w.commentProfilePictures = CASE
  WHEN w.commentProfilePictures IS NULL THEN [newProfilePic]
  ELSE w.commentProfilePictures + [newProfilePic]
END,
w.commentDates = CASE
  WHEN w.commentDates IS NULL THEN [newCreatedAt]
  ELSE w.commentDates + [newCreatedAt]
END

RETURN newText AS text, newUsername AS username, newUserId AS userId, newProfilePic AS profilePicture, newCreatedAt AS createdAt
      `,
      {userId: userId, watchedId: neo4j.int(watchedId), commentText}
    );
    const record = result.records[0];
    return {
      success: true,
      comment: record.toObject(),
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
      MATCH ()-[w:WATCHED]->() WHERE id(w) = $watchedId
      RETURN w.commentTexts as texts,
            w.commentUsernames as usernames,
            w.commentUserIds as userIds,
            w.commentProfilePictures as profilePicture,
            w.commentDates as dates
      `,
      {watchedId: neo4j.int(watchedId)}
    );

    if (!result.records.length) {
      return {
        success: true,
        comments: [],
      };
    }

    const record = result.records[0];
    const texts = record.get("texts");
    const usernames = record.get("usernames");
    const userIds = record.get("userIds");
    const profilePictures = record.get("profilePicture");
    const dates = record.get("dates");
    const comments = texts.map((text, index) => ({
      id: index,
      text: text,
      username: usernames[index],
      profilePicture: profilePictures[index],
      createdAt: dates[index],
    }));
    return {
      success: true,
      comments: comments,
    };
  } finally {
    await session.close();
  }
}

async function getLikesCount(watchedId) {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH ()-[w:WATCHED]->() WHERE id(w) = $watchedId
      RETURN size(coalesce(w.likedBy,[])) as likesCount
      `,
      {watchedId: neo4j.int(watchedId)}
    );

    if (result.records.length === 0) {
      return 0;
    }
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
      MATCH ()-[w:WATCHED]->() WHERE id(w) = $watchedId
      RETURN $userId IN coalesce(w.likedBy, []) as hasLiked
      `,
      {watchedId: neo4j.int(watchedId), userId}
    );

    if (result.records.length === 0) {
      return false;
    }
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
