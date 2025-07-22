// https://neo4j.com/docs/api/python-driver/current/api.html#neo4jdriver
// https://neo4j.com/docs/javascript-manual/5/query-advanced/
const {RESULT_INDEX} = require("./constants.js");
const {getSession} = require("./neo4j");

// TODO: refactor add and get functions
// may get conditionally dependent because the params differ slightly

// adds a TV show to watched list AND removes from want-to-watch if it exists
// Params: showData {userId, tvdbId, posterPath, rating, review}
// Returns: show object
const addWatchedTVShow = async (showData) => {
  const {userId, tvdbId, posterPath, name, overview, rating, review} = showData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (s:TVShow {tvdbId: $tvdbId})
            ON CREATE SET s.posterPath = $posterPath
            ON CREATE SET s.title = $name
            ON CREATE SET s.overview = $overview
            WITH u, s
            
            OPTIONAL MATCH (u)-[wtw:WANT_TO_WATCH]->(s)
            DELETE wtw
            
            WITH u, s
            MERGE (u)-[w:WATCHED]->(s)
            ON CREATE SET w.rating = $rating, w.review = $review, w.watchedAt = datetime()
            
            RETURN s, w
            `,
      {
        userId,
        tvdbId: parseInt(tvdbId),
        posterPath,
        name,
        overview,
        rating: rating ? parseInt(rating) : null,
        review: review || null,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add watched TV show");
    }

    return {
      userId,
      tvdbId,
      posterPath,
      rating,
      review,
    };
  } finally {
    await session.close();
  }
};

// Gets all the TV shows watched by a certain user
// params: userId(int)
// returns: an array of show objects
const getWatchedTVShowsByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[w:WATCHED]->(s:TVShow)
            RETURN s.tvdbId as tvdbId,
            s.posterPath as posterPath,
            w.title as name,
            w.overview as overview,
            w.rating as rating,
            w.review as review,
            w.watchedAt as watchedAt
            ORDER BY w.watchedAt DESC
               `,
      {
        userId,
      }
    );

    return result.records.map((record) => ({
      tvdbId: record.get("tvdbId"),
      posterPath: record.get("posterPath"),
      title: record.get("name"),
      overview: record.get("overview"),
      rating: record.get("rating"),
      review: record.get("review"),
      watchedAt: record.get("watchedAt"),
    }));
  } finally {
    await session.close();
  }
};

// adds a TV show to want to watch list
// Params: showData {userId, tvdbId, posterPath}
// Returns: show object
const addWantToWatchTVShow = async (showData) => {
  const {userId, tvdbId, posterPath, name, overview} = showData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (s:TVShow {tvdbId: $tvdbId})
            ON CREATE SET s.posterPath = $posterPath
            MERGE (u)-[w:WANT_TO_WATCH]->(s)
            ON CREATE SET w.addedAt = datetime()
            RETURN s, w
            `,
      {
        userId,
        tvdbId: parseInt(tvdbId),
        posterPath,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add want to watch TV show");
    }

    return result.records[RESULT_INDEX].get("w").properties;
  } catch (error) {
    console.error("Error adding TV show to want to watch:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Add to Favorites
// Params: showData {userId, tvdbId, posterPath}
// Returns: show object
const addFavoriteTVShow = async (showData) => {
  const {userId, tvdbId, posterPath} = showData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (s:TVShow {tvdbId: $tvdbId})
            ON CREATE SET s.posterPath = $posterPath
            MERGE (u)-[f:FAVORITE]->(s)
            ON CREATE SET f.addedAt = datetime()
            RETURN s, f
            `,
      {
        userId,
        tvdbId: parseInt(tvdbId),
        posterPath,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add TV show to favorites");
    }

    return result.records[0].get("f").properties;
  } catch (error) {
    console.error("Error adding TV show to favorites:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Add to Currently Watching
// Params: showData {userId, tvdbId, posterPath, review}
// Returns: show object
const addCurrentlyWatchingTVShow = async (showData) => {
  const {userId, tvdbId, posterPath, name, overview, review} = showData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (s:TVShow {tvdbId: $tvdbId})
            ON CREATE SET s.posterPath = $posterPath
            ON CREATE SET s.title = $name
            ON CREATE SET s.overview = $overview
            MERGE (u)-[c:CURRENTLY_WATCHING]->(s)
            ON CREATE SET c.review = $review, c.addedAt = datetime()
            RETURN s, c
            `,
      {
        userId,
        tvdbId: parseInt(tvdbId),
        posterPath,
        name,
        overview,
        review: review || null,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add TV show to currently watching");
    }

    return result.records[0].get("c").properties;
  } catch (error) {
    console.error("Error adding TV show to currently watching:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Get Want to Watch TV Shows
// Params: userId(int)
// Returns: array of show objects
const getWantToWatchTVShowsByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[w:WANT_TO_WATCH]->(s:TVShow)
            RETURN s.tvdbId as tvdbId, 
            s.posterPath as posterPath,
            w.addedAt as addedAt
            ORDER BY w.addedAt DESC
            `,
      {userId}
    );

    return result.records.map((record) => ({
      tvdbId: record.get("tvdbId"),
      posterPath: record.get("posterPath"),
      addedAt: record.get("addedAt"),
    }));
  } catch (error) {
    console.error("Error getting want to watch TV shows:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Get Favorite TV Shows
// Params: userId(int)
// Returns: array of show objects
const getFavoriteTVShowsByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[f:FAVORITE]->(s:TVShow)
            RETURN s.tvdbId as tvdbId, 
            s.posterPath as posterPath,
            f.addedAt as addedAt
            ORDER BY f.addedAt DESC
            `,
      {userId}
    );

    return result.records.map((record) => ({
      tvdbId: record.get("tvdbId"),
      posterPath: record.get("posterPath"),
      addedAt: record.get("addedAt"),
    }));
  } catch (error) {
    console.error("Error getting favorite TV shows:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Get Currently Watching TV Shows
// Params: userId(int)
// Returns: array of show objects
const getCurrentlyWatchingTVShowsByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[c:CURRENTLY_WATCHING]->(s:TVShow)
            RETURN s.tvdbId as tvdbId, 
            s.posterPath as posterPath,
            s.title as name,
            s.overview as overview,
            s.review as review,
            c.addedAt as addedAt
            ORDER BY c.addedAt DESC
            `,
      {userId}
    );

    return result.records.map((record) => ({
      tvdbId: record.get("tvdbId"),
      posterPath: record.get("posterPath"),
      name: record.get("name"),
      overview: record.get("overview"),
      review: record.get("review"),
      addedAt: record.get("addedAt"),
    }));
  } catch (error) {
    console.error("Error getting currently watching TV shows:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// generic helper function to remove TV show relationships in the database
const removeTVShow = async (userId, tvdbId, relationship) => {
  const session = getSession();

  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[r:${relationship}]->(s:TVShow{tvdbId: $tvdbId})
      DELETE r
      RETURN count(r) as deleteCount`,
      {
        userId,
        tvdbId: parseInt(tvdbId),
      }
    );

    if (result.records.length === 0) {
      return false;
    }

    const deleteCount = result.records[0].get("deleteCount").toNumber();
    return deleteCount > 0;
  } finally {
    await session.close();
  }
};

// Removes TV show from watched list
// params: userId(int), tvdbId(int)
// returns: boolean true if removed false otherwise
const removeWatchedTVShow = async (userId, tvdbId) => {
  return await removeTVShow(userId, tvdbId, "WATCHED");
};

// Remove from favorites
// params: userId(int), tvdbId(int)
// returns: boolean true if removed false otherwise
const removeFavoriteTVShow = async (userId, tvdbId) => {
  return await removeTVShow(userId, tvdbId, "FAVORITE");
};

// Remove from want to watch
// params: userId(int), tvdbId(int)
// returns: boolean true if removed false otherwise
const removeWantToWatchTVShow = async (userId, tvdbId) => {
  return await removeTVShow(userId, tvdbId, "WANT_TO_WATCH");
};

module.exports = {
  addWatchedTVShow,
  removeWatchedTVShow,
  removeFavoriteTVShow,
  removeWantToWatchTVShow,
  addCurrentlyWatchingTVShow,
  addWantToWatchTVShow,
  getWatchedTVShowsByUser,
  getCurrentlyWatchingTVShowsByUser,
  getFavoriteTVShowsByUser,
  addFavoriteTVShow,
  getWantToWatchTVShowsByUser,
};
