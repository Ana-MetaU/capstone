const express = require("express");
const router = express.Router();

const {getFeed} = require("../database/feedUtils");

router.get("/", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const feedData = await getFeed(req.session.userId, page, limit);
    console.log("feedata", feedData);
    res.json({
      success: true,
      message: "Feed fetched successfully",
      feed: feedData.feedItems,
      pagination: {
        currentPage: feedData.currentPage,
        hasNextPage: feedData.hasNextPage,
      },
    });
  } catch (error) {
    console.log("error fetchign feed", error);
    res.status(500).json({error: "Failed to fetch feed"});
  }
});

module.exports = router;
