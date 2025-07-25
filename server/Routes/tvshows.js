const express = require("express");
const router = express.Router();
const {SUCCESS} = require("../database/constants.js");
const {
  addWatchedTVShow,
  getWatchedTVShowsByUser,
  removeFavoriteTVShow,
  removeWantToWatchTVShow,
  getCurrentlyWatchingTVShowsByUser,
  getFavoriteTVShowsByUser,
  getWantToWatchTVShowsByUser,
  addCurrentlyWatchingTVShow,
  addWantToWatchTVShow,
  addFavoriteTVShow,
  removeWatchedTVShow,
} = require("../database/tvShowUtils.js");

// Helper function for input validation
const validateInput = (input) => {
  const {tvdbId} = input;
  if (!tvdbId) {
    return "TVDB ID is required";
  }
  return SUCCESS;
};

// Generic GET TV shows handler
async function getTVShows(req, res, fetchFunction, type) {
  if (!req.session.userId) {
    return res.status(401).json({error: "log in first"});
  }

  try {
    const fetchedTVShows = await fetchFunction(req.session.userId);
    res.status(200).json({
      message: `${type} TV shows fetched successfully`,
      shows: fetchedTVShows,
    });

    console.log("getting movies", fetchedTVShows);
  } catch (error) {
    console.log(`Error fetching ${type} TV shows:`, error);
    res.status(500).json({error: `Failed to fetch ${type} TV shows`});
  }
}

// Generic POST TV shows handler
async function postTVShow(req, res, postFunction, type) {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const {tvdbId, posterPath, rating, name,overview, review} = req.body;

    // Validate required input
    const validInput = validateInput({tvdbId});
    if (validInput !== SUCCESS) {
      return res.status(400).json({error: validInput});
    }

    let showData;

    if (type === "watched") {
      showData = {
        userId: req.session.userId,
        tvdbId,
        posterPath,
        name,
        overview,
        rating,
        review,
      };
    } else if (type === "currently watching") {
      showData = {
        userId: req.session.userId,
        tvdbId,
        name,
        overview,
        posterPath,
        review,
      };
    } else {
      // favorites and want-to-watch showData
      showData = {
        userId: req.session.userId,
        tvdbId,
        posterPath,
      };
    }

    const result = await postFunction(showData);

    res.status(201).json({
      success: true,
      message: `TV show added to ${type} successfully`,
    });
  } catch (error) {
    console.error(`Error adding ${type} TV show:`, error);
    res.status(500).json({
      error: `Something went wrong while adding TV show to ${type}`,
    });
  }
}

// Generic DELETE TV shows handler
async function deleteTVShow(req, res, deleteFunction, type) {
  const {tvdbId} = req.params;

  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const validInput = validateInput({tvdbId});
    if (validInput !== SUCCESS) {
      return res.status(400).json({error: validInput});
    }

    const removed = await deleteFunction(req.session.userId, tvdbId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: `TV show not found in ${type} list`,
      });
    }

    res.json({
      success: true,
      message: `TV show was removed from ${type} list`,
    });
  } catch (error) {
    console.log(`Error removing ${type} TV show:`, error);
    res.status(500).json({
      error: `Something went wrong while removing TV show from ${type} list`,
    });
  }
}

//
// GET ROUTES
//
router.get("/favorites", async (req, res) => {
  return await getTVShows(req, res, getFavoriteTVShowsByUser, "favorite");
});

router.get("/watched", async (req, res) => {
  return await getTVShows(req, res, getWatchedTVShowsByUser, "watched");
});

router.get("/wanttowatch", async (req, res) => {
  return await getTVShows(
    req,
    res,
    getWantToWatchTVShowsByUser,
    "want to watch"
  );
});

router.get("/currentlywatching", async (req, res) => {
  return await getTVShows(
    req,
    res,
    getCurrentlyWatchingTVShowsByUser,
    "currently watching"
  );
});

//
// POST ROUTES
//
router.post("/favorites", async (req, res) => {
  return await postTVShow(req, res, addFavoriteTVShow, "favorites");
});

router.post("/watched", async (req, res) => {
  return await postTVShow(req, res, addWatchedTVShow, "watched");
});

router.post("/wanttowatch", async (req, res) => {
  return await postTVShow(req, res, addWantToWatchTVShow, "want to watch");
});

router.post("/currentlywatching", async (req, res) => {
  return await postTVShow(
    req,
    res,
    addCurrentlyWatchingTVShow,
    "currently watching"
  );
});

//
// DELETE ROUTES
//
router.delete("/favorites/:tvdbId", async (req, res) => {
  return await deleteTVShow(req, res, removeFavoriteTVShow, "favorites");
});

router.delete("/watched/:tvdbId", async (req, res) => {
  return await deleteTVShow(req, res, removeWatchedTVShow, "watched");
});

router.delete("/wanttowatch/:tvdbId", async (req, res) => {
  return await deleteTVShow(req, res, removeWantToWatchTVShow, "want to watch");
});

//TODO: WRITE REMOVE CURRENTLY WATCHING
module.exports = router;
