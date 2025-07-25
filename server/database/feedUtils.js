const {getSession} = require("./neo4j");
const neo4j = require("neo4j-driver");
async function getFeed(userId, page, limit) {
  const session = getSession();

  try {
    const offset = parseInt(page - 1) * limit;
    const query = `
  MATCH (author: User)-[:HAS_PROFILE]->(profile: Profile {privacyLevel: 'public'})
MATCH (author)-[watched: WATCHED]->(content)
WHERE (content:Movie OR content:TVShow)
AND author.id <> $userId
RETURN watched {
  .id,
  .rating,
  .review,
  .watchedAt
} as post,
author {
  .id,
  .username
} as author,
profile {
  .profilePicture,
  .privacyLevel
} as profile,
content {
  .title,
  .posterPath,
  .overview
} as contentDetails,
labels(content)[0] as contentType,
size(coalesce(watched.likedBy,[])) as likesCount,
size(coalesce(watched.commentTexts, [])) as commentsCount,
$userId IN coalesce(watched.likedBy, []) as userLiked,
id(watched) as watchedId,
'public' as category

UNION

MATCH (me: User {id: $userId})
MATCH (author: User)-[:HAS_PROFILE]->(profile: Profile {privacyLevel: 'friends_of_friends'})
MATCH (author)-[watched: WATCHED]->(content)
WHERE (content:Movie OR content:TVShow)
AND author.id <> me
AND (
  (me)-[:FOLLOWS]->(author)  
  OR 
  EXISTS {
    MATCH (me)-[:FOLLOWS]->(someone:User)-[:FOLLOWS]->(author)
  }
)
RETURN watched {
  .id,
  .rating,
  .review,
  .watchedAt
} as post,
author {
  .id,
  .username
} as author,
profile {
  .profilePicture,
  .privacyLevel
} as profile,
content {
  .title,
  .posterPath,
  .overview
} as contentDetails,
labels(content)[0] as contentType,
size(coalesce(watched.likedBy,[])) as likesCount,
size(coalesce(watched.commentTexts, [])) as commentsCount,
$userId IN coalesce(watched.likedBy, []) as userLiked,
id(watched) as watchedId,
'friends_of_friends' as category

UNION

MATCH (me: User {id: $userId})-[:FOLLOWS]->(author: User)
MATCH (author)-[:HAS_PROFILE]->(profile: Profile {privacyLevel: 'friends_only'})
MATCH (author)-[watched: WATCHED]->(content)
WHERE (content: Movie OR content: TVShow)
AND author <> me
RETURN watched {
  .id,
  .rating,
  .review,
  .watchedAt
} as post,
author {
  .id,
  .username
} as author,
profile {
  .profilePicture,
  .privacyLevel
} as profile,
content {
  .title,
  .posterPath,
  .overview
} as contentDetails,
labels(content)[0] as contentType,
size(coalesce(watched.likedBy,[])) as likesCount,
size(coalesce(watched.commentTexts, [])) as commentsCount,
$userId IN coalesce(watched.likedBy, []) as userLiked,
id(watched) as watchedId,
'friends_only' as category

ORDER BY post.createdAt DESC
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
        id: record.get("author").id,
        username: record.get("author").username,
        profilePicture: record.get("profile").profilePicture,
        privacyLevel: record.get("profile").privacyLevel,
      },
      content: {
        title: record.get("contentDetails").title,
        posterPath: record.get("contentDetails").posterPath,
        overview: record.get("contentDetails").overview,
        type: record.get("contentType"),
      },
      rating: {
        rating: record.get("post").rating,
        review: record.get("post").review,
        watchedAt: record.get("post").watchedAt.toString(),
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
