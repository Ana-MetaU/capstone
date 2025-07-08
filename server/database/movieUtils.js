// https://neo4j.com/docs/api/python-driver/current/api.html#neo4jdriver
// https://neo4j.com/docs/javascript-manual/5/query-advanced/
const {RESULT_INDEX} = require("./constants.js");
const {getSession} = require("./neo4j");

// TODO: refactor add and get functions
// may get conditionally dpenedent becuase the params defer slightly

// adds a movie to watched list AND removes from want-to-watch if it exists
// Params: movieData {userId, tmdbId, posterPath, rating, review}
// Returns: movie object
const addWatchedMovie = async (movieData) => {
  const {userId, tmdbId, posterPath, rating, review} = movieData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (m:Movie {tmdbId: $tmdbId})
            ON CREATE SET m.posterPath = $posterPath
            
            WITH u, m
            
            OPTIONAL MATCH (u)-[wtw:WANT_TO_WATCH]->(m)
            DELETE wtw
            
            WITH u, m
            MERGE (u)-[w:WATCHED]->(m)
            ON CREATE SET w.rating = $rating, w.review = $review, w.watchedAt = datetime()
            
            RETURN m, w
            `,
      {
        userId,
        tmdbId: parseInt(tmdbId),
        posterPath,
        rating: rating ? parseInt(rating) : null,
        review: review || null,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add watched movie");
    }

    return {
      userId,
      tmdbId,
      posterPath,
      rating,
      review,
    };
  } finally {
    await session.close();
  }
};

// Gets all the movies watched by a certain user
// params: userId(int)
// returns: an array of movie objects
const getWatchedMoviesByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[w:WATCHED]->(m:Movie)
            RETURN m.tmdbId as tmdbId,
            m.posterPath as posterPath,
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
      tmdbId: record.get("tmdbId"),
      posterPath: record.get("posterPath"),
      rating: record.get("rating"),
      review: record.get("review"),
      watchedAt: record.get("watchedAt"),
    }));
  } finally {
    await session.close();
  }
};

// adds a movie to want to watch list
// Params: movieData {userId, tmdbId, posterPath}
// Returns: movie object
const addWantToWatchMovie = async (movieData) => {
  const {userId, tmdbId, posterPath} = movieData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (m:Movie {tmdbId: $tmdbId})
            ON CREATE SET m.posterPath = $posterPath
            MERGE (u)-[w:WANT_TO_WATCH]->(m)
            ON CREATE SET w.addedAt = datetime()
            RETURN m, w
            `,
      {
        userId,
        tmdbId: parseInt(tmdbId),
        posterPath,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add want to watch movie");
    }

    return result.records[RESULT_INDEX].get("w").properties;
  } catch (error) {
    console.error("Error adding movie to want to watch:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Add to Favorites
// Params: movieData {userId, tmdbId, posterPath}
// Returns: movie object
const addFavoriteMovie = async (movieData) => {
  const {userId, tmdbId, posterPath} = movieData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (m:Movie {tmdbId: $tmdbId})
            ON CREATE SET m.posterPath = $posterPath
            MERGE (u)-[f:FAVORITE]->(m)
            ON CREATE SET f.addedAt = datetime()
            RETURN m, f
            `,
      {
        userId,
        tmdbId: parseInt(tmdbId),
        posterPath,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add movie to favorites");
    }

    return result.records[0].get("f").properties;
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Add to Currently Watching
// Params: movieData {userId, tmdbId, posterPath, review}
// Returns: movie object
const addCurrentlyWatchingMovie = async (movieData) => {
  const {userId, tmdbId, posterPath, review} = movieData;
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})
            MERGE (m:Movie {tmdbId: $tmdbId})
            ON CREATE SET m.posterPath = $posterPath
            MERGE (u)-[c:CURRENTLY_WATCHING]->(m)
            ON CREATE SET c.review = $review, c.addedAt = datetime()
            RETURN m, c
            `,
      {
        userId,
        tmdbId: parseInt(tmdbId),
        posterPath,
        review: review || null,
      }
    );

    const records = result.records.length;
    if (!records) {
      throw new Error("failed to add movie to currently watching");
    }

    return result.records[0].get("c").properties;
  } catch (error) {
    console.error("Error adding movie to currently watching:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Get Want to Watch Movies
// Params: userId(int)
// Returns: array of movie objects
const getWantToWatchMoviesByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[w:WANT_TO_WATCH]->(m:Movie)
            RETURN m.tmdbId as tmdbId, 
            m.posterPath as posterPath,
            w.addedAt as addedAt
            ORDER BY w.addedAt DESC
            `,
      {userId}
    );

    return result.records.map((record) => ({
      tmdbId: record.get("tmdbId"),
      posterPath: record.get("posterPath"),
      addedAt: record.get("addedAt"),
    }));
  } catch (error) {
    console.error("Error getting want to watch movies:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Get Favorite Movies
// Params: userId(int)
// Returns: array of movie objects
const getFavoriteMoviesByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[f:FAVORITE]->(m:Movie)
            RETURN m.tmdbId as tmdbId, 
            m.posterPath as posterPath,
            f.addedAt as addedAt
            ORDER BY f.addedAt DESC
            `,
      {userId}
    );

    return result.records.map((record) => ({
      tmdbId: record.get("tmdbId"),
      posterPath: record.get("posterPath"),
      addedAt: record.get("addedAt"),
    }));
  } catch (error) {
    console.error("Error getting favorite movies:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// Get Currently Watching Movies
// Params: userId(int)
// Returns: array of movie objects
const getCurrentlyWatchingMoviesByUser = async (userId) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
            MATCH (u:User {id: $userId})-[c:CURRENTLY_WATCHING]->(m:Movie)
            RETURN m.tmdbId as tmdbId, 
            m.posterPath as posterPath,
            c.review as review,
            c.addedAt as addedAt
            ORDER BY c.addedAt DESC
            `,
      {userId}
    );

    return result.records.map((record) => ({
      tmdbId: record.get("tmdbId"),
      posterPath: record.get("posterPath"),
      review: record.get("review"),
      addedAt: record.get("addedAt"),
    }));
  } catch (error) {
    console.error("Error getting currently watching movies:", error);
    throw error;
  } finally {
    await session.close();
  }
};

// generic helepr function to remove movie relationships in the database
const removeMovie = async (userId, tmdbId, relationship) => {
  const session = getSession();

  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[r:${relationship}]->(m:Movie{tmdbId: $tmdbId})
      DELETE r
      RETURN count(r) as deleteCount`,
      {
        userId,
        tmdbId: parseInt(tmdbId),
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

// Removes movie from watched list
// params: userId(int), tmdbId(int)
// returns: boolean true if removed false otherwise
const removeWatchedMovie = async (userId, tmdbId) => {
  return await removeMovie(userId, tmdbId, "WATCHED");
};

// Remove from favorites
// params: userId(int), tmdbId(int)
// returns: boolean true if removed false otherwise
const removeFavoriteMovie = async (userId, tmdbId) => {
  return await removeMovie(userId, tmdbId, "FAVORITE");
};

// Remove from want to watch
// params: userId(int), tmdbId(int)
// returns: boolean true if removed false otherwise
const removeWantToWatchMovie = async (userId, tmdbId) => {
  return await removeMovie(userId, tmdbId, "WANT_TO_WATCH");
};

module.exports = {
  addWatchedMovie,
  removeWatchedMovie,
  removeFavoriteMovie,
  removeWantToWatchMovie,
  addCurrentlyWatchingMovie,
  addWantToWatchMovie,
  getWatchedMoviesByUser,
  getCurrentlyWatchingMoviesByUser,
  getFavoriteMoviesByUser,
  addFavoriteMovie,
  getWantToWatchMoviesByUser,
};
