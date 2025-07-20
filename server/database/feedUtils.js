const {getSession} = require("./neo4j");
const neo4j = require("neo4j-driver");
async function getFeed(userId, page, limit) {
  const session = getSession();

  try {
    console.log("heyyy heyyy ");

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
    labels(content)[0] AS contentType
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

module.exports = {
  getFeed,
};
