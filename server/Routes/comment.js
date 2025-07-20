const express = require("express");
const router = express.Router();
const {addComment, getComments} = require("../database/feedUtils");

router.post("/:watchedId", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const userId = req.session.userId;
    const watchedId = parseInt(req.params.watchedId);
    const {text} = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({error: "comment text is required"});
    }

    const result = await addComment(userId, watchedId, text.trim());

    if (result.success) {
      res.status(201).json({
        success: true,
        message: "comment addded",
        comment: result.comment,
      });
    } else {
      res.status(500).json({error: "failed to add comment"});
    }
  } catch (error) {
    console.log("error adding comment", error);
    res.status(500).json({error: "failed to add comment"});
  }
});

router.get("/:watchedId", async (req, res) => {
  try {
    const watchedId = parseInt(req.params.watchedId);
    const comments = await getComments(watchedId);

    res.json({
      success: true,
      comments: comments,
      count: comments.length,
    });
  } catch (error) {
    console.log("error getting comments", error);
    res.status(500).json({error: "failed to get comment"});
  }
});
module.exports = router;
