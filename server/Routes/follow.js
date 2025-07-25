const express = require("express");
const router = express.Router();

const {getProfilePrivacy} = require("../database/profileUtils");

const {
  createFollowRelationship,
  getFollowers,
  getFollowing,
  isFollowing,
  removeFollowRelationship,
} = require("../database/followUtils");

const {
  findFollowRequest,
  createFollowRequest,
  deleteFollowRequest,
  getIncomingRequest,
  getOutgoingRequests,
} = require("../prisma/followRequestUtils");

// Send follow request request
router.post("/follow/:userId", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const followerId = req.session.userId;
    const followeeId = req.params.userId;

    if (followerId === followeeId) {
      return res.status(400).json({error: "Cannot follow yourself."});
    }

    isPublic = await getProfilePrivacy(followeeId);

    if (isPublic.isPublic) {
      await createFollowRelationship(followerId, followeeId);
      res.status(201).json({
        success: true,
        message: "successfully followed user",
      });
    } else {
      // private profile (send to postgress database first)
      const existingRequest = await findFollowRequest(followerId, followeeId);

      if (existingRequest) {
        return res
          .status(400)
          .json({error: "there is already a follow request"});
      }

      await createFollowRequest(followerId, followeeId);

      res.status(201).json({
        success: true,
        message: "Follow request sent",
      });
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({error: "Failed to follow request"});
  }
});

// accept follow request
router.post("/accept/:userId", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }
  try {
    const recipientId = req.session.userId; // accepting
    const requesterId = req.params.userId; // person who sent

    const followRequest = await findFollowRequest(requesterId, recipientId);

    if (!followRequest) {
      return res.status(404).json({error: "Follow request not found"});
    }

    if (followRequest.status !== "pending") {
      return res.status(400).json({error: "follow reuqest is not pending"});
    }

    await createFollowRelationship(requesterId, recipientId);

    await deleteFollowRequest(followRequest.id);
    res.json({
      success: true,
      message: "Follow reuqest accpeted",
    });
  } catch (error) {
    console.log("error accpeting follow request");
    res.status(500).json({error: "Failed to accept follow request"});
  }
});

// reject follow request
router.post("/reject/:userId", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }
  try {
    const recipientId = req.session.userId; // rejecting
    const requesterId = req.params.userId; // person who sent

    const followRequest = await findFollowRequest(requesterId, recipientId);

    if (!followRequest) {
      return res.status(404).json({error: "Follow request not found"});
    }

    if (followRequest.status !== "pending") {
      return res
        .status(400)
        .json({error: "can only reject pending follow requests"});
    }

    await deleteFollowRequest(followRequest.id);

    res.json({
      success: true,
      message: "follow request rejected",
    });
  } catch (error) {
    console.log("error rejecting follow request");
    res.status(500).json({error: "Failed to reject follow request"});
  }
});

// check who the current user logged in is following
router.get("/following", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const userId = req.session.userId;
    const following = await getFollowing(userId);

    res.json({
      success: true,
      message: "List of people you are following has been fetched successfully",
      following: following,
      count: following.length,
    });
  } catch (error) {
    console.log("error fetching following list", error);
    res.status(500).json({error: "Failed to fetch following list"});
  }
});

// check the current user's followers
router.get("/followers", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const userId = req.session.userId;
    const followers = await getFollowers(userId);

    res.json({
      success: true,
      message: "List of people that follow you has been fetched successfully",
      followers: followers,
      count: followers.length,
    });
  } catch (error) {
    console.log("error fetching followers list", error);
    res.status(500).json({error: "Failed to fetch followers list"});
  }
});

// Get all incoming follow requests
router.get("/incoming", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const userId = req.session.userId;
    const incomingRequests = await getIncomingRequest(userId);

    res.json({
      success: true,
      message: "Incoming requests fetched successfully",
      requests: incomingRequests,
    });
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    res.status(500).json({error: "Failed to fetch incoming requests"});
  }
});

// Get all outgoing follow requests
router.get("/outgoing", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const userId = req.session.userId;
    const outgoingRequests = await getOutgoingRequests(userId);

    res.json({
      success: true,
      message: "Outgoing requests fetched successfully",
      requests: outgoingRequests,
    });
  } catch (error) {
    console.error("Error fetching outgoing requests:", error);
    res.status(500).json({error: "Failed to fetch outgoing requests"});
  }
});

// unfollow another user
router.delete("/unfollow/:userId", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const followerId = req.session.userId;
    const followeeId = req.params.userId;

    if (followerId === followeeId) {
      return res.status(400).json({error: "Can't unfollow yourslef"});
    }

    const isCurrentlyFollowing = await isFollowing(followerId, followeeId);

    if (!isCurrentlyFollowing) {
      return res.status(400).json({error: "You are not following this user"});
    }

    await removeFollowRelationship(followerId, followeeId);

    res.json({
      success: true,
      message: "succesfully unfollowed user",
    });
  } catch (error) {
    console.log("error unfollowing user", error);

    res.status(500).json({error: "Failed to unfollow user"});
  }
});

// check the status betweeen two users
router.get("/status/:userId", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const userId = req.session.userId;
    const targetUserId = req.params.userId;

    if (userId === targetUserId) {
      return res
        .status(400)
        .json({error: "cannot have a follow relationship with yourself"});
    }

    const following = await isFollowing(userId, targetUserId);

    if (following) {
      return res.json({
        success: true,
        status: "following",
      });
    }

    const pending = await findFollowRequest(userId, targetUserId);

    if (pending && pending.status === "pending") {
      return res.json({
        success: true,
        status: "request sent",
      });
    }

    incoming = await findFollowRequest(targetUserId, userId);
    if (incoming && incoming.status === "pending") {
      return res.json({
        success: true,
        status: "request recieved",
      });
    }

    res.json({
      success: true,
      status: "none",
    });
  } catch (error) {
    console.log("could not check status between the two users", error);
  }
});

module.exports = router;
