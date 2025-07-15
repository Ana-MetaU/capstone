const express = require("express");
const router = express.Router();
const {SUCCESS} = require("../database/constants.js");
const {
  addWatchedMovie,
  getWatchedMoviesByUser,
  removeFavoriteMovie,
  removeWantToWatchMovie,
  getCurrentlyWatchingMoviesByUser,
  getFavoriteMoviesByUser,
  getWantToWatchMoviesByUser,
  addCurrentlyWatchingMovie,
  addWantToWatchMovie,
  addFavoriteMovie,
  removeWatchedMovie,
} = require("../database/movieUtils.js");

// Helper function for input validation
const validateInput = (input) => {
  const {tmdbId} = input;
  if (!tmdbId) {
    return "tmdb ID is required";
  }
  return SUCCESS;
};

// Generic GET movies handler
async function getMovies(req, res, fetchFunction, type) {
  if (!req.session.userId) {
    return res.status(401).json({error: "log in first"});
  }

  try {
    const fetchedMovies = await fetchFunction(req.session.userId);
    res.status(200).json({
      message: `${type} movies fetched successfully`,
      movies: fetchedMovies,
    });
  } catch (error) {
    console.log(`Error fetching ${type} movies:`, error);
    res.status(500).json({error: `Failed to fetch ${type} movies`});
  }
}

// Generic POST movies handler
async function postMovie(req, res, postFunction, type) {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const {tmdbId, posterPath, rating, review} = req.body;

    // Validate required input
    const validInput = validateInput({tmdbId});
    if (validInput !== SUCCESS) {
      return res.status(400).json({error: validInput});
    }

    let movieData;

    if (type === "watched") {
      movieData = {
        userId: req.session.userId,
        tmdbId,
        posterPath,
        rating,
        review,
      };
    } else if (type === "currently watching") {
      movieData = {
        userId: req.session.userId,
        tmdbId,
        posterPath,
        review,
      };
    } else {
      // favorites and want-to-watch movieData
      movieData = {
        userId: req.session.userId,
        tmdbId,
        posterPath,
      };
    }

    const result = await postFunction(movieData);

    res.status(201).json({
      success: true,
      message: `Movie added to ${type} successfully`,
    });
  } catch (error) {
    console.error(`Error adding ${type} movie:`, error);
    res.status(500).json({
      error: `Something went wrong while adding movie to ${type}`,
    });
  }
}

// Generic DELETE movies handler
async function deleteMovie(req, res, deleteFunction, type) {
  const {tmdbId} = req.params;

  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const validInput = validateInput({tmdbId});
    if (validInput !== SUCCESS) {
      return res.status(400).json({error: validInput});
    }

    const removed = await deleteFunction(req.session.userId, tmdbId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: `Movie not found in ${type} list`,
      });
    }

    res.json({
      success: true,
      message: `Movie was removed from ${type} list`,
    });
  } catch (error) {
    console.log(`Error removing ${type} movie:`, error);
    res.status(500).json({
      error: `Something went wrong while removing movie from ${type} list`,
    });
  }
}

//
// GET ROUTES
//
router.get("/favorites", async (req, res) => {
  return await getMovies(req, res, getFavoriteMoviesByUser, "favorite");
});

router.get("/watched", async (req, res) => {
  return await getMovies(req, res, getWatchedMoviesByUser, "watched");
});

router.get("/wanttowatch", async (req, res) => {
  return await getMovies(req, res, getWantToWatchMoviesByUser, "want to watch");
});

router.get("/currentlywatching", async (req, res) => {
  return await getMovies(
    req,
    res,
    getCurrentlyWatchingMoviesByUser,
    "currently watching"
  );
});


//
// POST ROUTES
//
router.post("/favorites", async (req, res) => {
  return await postMovie(req, res, addFavoriteMovie, "favorites");
});

router.post("/watched", async (req, res) => {
  return await postMovie(req, res, addWatchedMovie, "watched");
});

router.post("/wanttowatch", async (req, res) => {
  return await postMovie(req, res, addWantToWatchMovie, "want to watch");
});

router.post("/currentlywatching", async (req, res) => {
  return await postMovie(
    req,
    res,
    addCurrentlyWatchingMovie,
    "currently watching"
  );
});

//
// DELETE ROUTES
//
router.delete("/favorites/:tmdbId", async (req, res) => {
  return await deleteMovie(req, res, removeFavoriteMovie, "favorites");
});

router.delete("/watched/:tmdbId", async (req, res) => {
  return await deleteMovie(req, res, removeWatchedMovie, "watched");
});

router.delete("/wanttowatch/:tmdbId", async (req, res) => {
  return await deleteMovie(req, res, removeWantToWatchMovie, "want to watch");
});

module.exports = router;
