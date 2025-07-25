const express = require("express");
const router = express.Router();
const reguireLogin = require("../middleware/requireLogin");
const {
  getUserStats,
  getUserProfileByUsername,
  searchUserByUsername,
} = require("../database/UsersUtils");
const {
  getWatchedMoviesByUser,
  getFavoriteMoviesByUser,
  getWantToWatchMoviesByUser,
} = require("../database/movieUtils");
const {
  getWatchedTVShowsByUser,
  getFavoriteTVShowsByUser,
  getWantToWatchTVShowsByUser,
} = require("../database/tvShowUtils");
const {requireLogin} = require("../middleware/requireLogin");

router.use(requireLogin);

// Generic GET movies handler
async function getMedia(req, res, fetchFunction, type) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status.json({error: "Missing target userId"});
  }
  try {
    const media = await fetchFunction(userId);
    res.status(200).json({
      message: `${type} movies fetched successfully`,
      movies: media,
    });
  } catch (error) {
    console.log(`Error fetching ${type} movies:`, error);
    res.status(500).json({error: `Failed to fetch ${type} movies`});
  }
}

// search by username
router.get("/search", async (req, res) => {
  try {
    const {q} = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({error: "must input a search query"});
    }

    const searchQuery = q.trim().toLowerCase();
    const searchResults = await searchUserByUsername(searchQuery);

    const searchResultsFiltered = searchResults.filter(
      (user) => user.userId !== req.session.userId
    );

    res.json({
      success: true,
      message: "Found some search results",
      results: searchResultsFiltered,
    });
  } catch (error) {
    console.log("error searching for users", error);
    res.status(500).json({error: "Failed to search for users"});
  }
});

router.get("/:username", async (req, res) => {
  try {
    const {username} = req.params;

    const userProfile = await getUserProfileByUsername(username);
    if (!userProfile) {
      return res.status(404).json({error: "User not found"});
    }

    res.json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.log("error getting profile by username", error);
    res.status(500).json({error: "Failed to get user profile"});
  }
});

// Media
router.get("/:userId/movies/watched", async (req, res) => {
  return await getMedia(req, res, getWatchedMoviesByUser, "watched");
});

router.get("/:userId/movies/favorites", async (req, res) => {
  return await getMedia(req, res, getFavoriteMoviesByUser, "favorites");
});

router.get("/:userId/movies/wanttowatch", async (req, res) => {
  return await getMedia(req, res, getWantToWatchMoviesByUser, "want to watch");
});

router.get("/:userId/tvshows/watched", async (req, res) => {
  return await getMedia(req, res, getWatchedTVShowsByUser, "watched");
});

router.get("/:userId/tvshows/favorites", async (req, res) => {
  return await getMedia(req, res, getFavoriteTVShowsByUser, "favorites");
});

router.get("/:userId/tvshows/wanttowatch", async (req, res) => {
  return await getMedia(req, res, getWantToWatchTVShowsByUser, "want to watch");
});

router.get("/:userId/stats", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userStats = await getUserStats(userId);
    if (!userStats) {
      return res.status(404).json({error: "User not found"});
    }

    res.json({
      success: true,
      stats: userStats,
    });
  } catch (error) {
    console.log("error getting user's stats", error);
    res.status(500).json({error: "Failed to get user stats"});
  }
});

module.exports = router;
