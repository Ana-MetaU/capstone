const express = require("express");
const router = express.Router();
const {requireLogin} = require("../middleware/requireLogin.js");

const {
  addLike,
  removeLike,
  getLikesCount,
  hasUserLiked,
} = require("../database/feedUtils");

router.post("/:watchedId", requireLogin, async (req, res) => {
  try {
    const userId = req.session.userId;
    const watchedId = req.params.watchedId;

    const alreadyLiked = await hasUserLiked(userId, watchedId);

    if (alreadyLiked) {
      return res.status(400).json({
        error: "you have already liked this post",
        alreadyLiked: true,
      });
    }
    const result = await addLike(userId, watchedId);
    if (result.success) {
      const likes = await getLikesCount(watchedId);
      res.json({
        success: true,
        message: "posted like successfully",
        likeCount: likes,
      });
    } else {
      res.status(500).json({error: "failed to like post"});
    }
  } catch (error) {
    console.log("Error liking post", error);
    res.status(500).json({error: "failed to like post"});
  }
});

router.delete("/:watchedId", requireLogin, async (req, res) => {
  try {
    const userId = req.session.userId;
    const watchedId = req.params.watchedId;

    const result = await removeLike(userId, watchedId);

    if (result.success) {
      const likes = await getLikesCount(watchedId);
      res.json({
        success: true,
        message: "like removed successfully",
        likeCount: likes,
      });
    } else {
      res.status(500).json({error: "failed to remove like"});
    }
  } catch (error) {
    console.log("error removing like", error);
    res.status(500).json({error: "failed to remove like"});
  }
});

router.get("/:watchedId/status", requireLogin, async (req, res) => {
  try {
    const userId = req.session.userId;
    const watchedId = parseInt(req.params.watchedId);

    const userLiked = await hasUserLiked(userId, watchedId);

    res.json({
      success: true,
      userLiked: userLiked,
    });
  } catch (error) {
    console.log("error checking like status", error);
    res.status(500).json({error: "failed to check like status"});
  }
});

router.get("/:watchedId/count", async (req, res) => {
  try {
    const watchedId = parseInt(req.params.watchedId);
    const likesCount = await getLikesCount(watchedId);
    res.json({
      success: true,
      likesCount: likesCount,
    });
  } catch (error) {
    console.log("error getting lkes count", error);
    res.status(500).json({error: "failed to get like count "});
  }
});

module.exports = router;
