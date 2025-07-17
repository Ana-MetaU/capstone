const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  userHasProfile,
} = require("../database/profileUtils");

// get a user profile
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({error: "no userId. Bad request"});
    }
    const profile = await getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({error: "Failed to fetch profile"});
  }
});

// Create user profile
router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({error: "no userId. Bad request"});
    }
    // Check if profile already exists
    const hasProfile = await userHasProfile(userId);
    if (hasProfile) {
      return res
        .status(409)
        .json({error: "Profile already exists for this user"});
    }
    const {bio, isPublic, profilePicture, favoriteGenres} = req.body;

    const profile = await createUserProfile(userId, {
      bio,
      isPublic,
      profilePicture,
      favoriteGenres,
    });
    res.status(201).json(profile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({error: "Failed to create profile"});
  }
});

// Update user profile
router.put("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({error: "no userId. Bad request"});
    }
    const {bio, isPublic, profilePicture, favoriteGenres} = req.body;

    const updatedProfile = await updateUserProfile(userId, {
      bio,
      isPublic,
      profilePicture,
      favoriteGenres,
    });

    res.json({updatedProfile});
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({error: "Failed to update profile"});
  }
});

//  Check if user has a profile
router.get("/:userId/exists", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).json({error: "no userId. Bad request"});
    }

    const hasProfile = await userHasProfile(userId);
    res.json({hasProfile});
  } catch (error) {
    console.error("Error checking if profile exists:", error);
    res.status(500).json({error: "Failed to check if profile exists"});
  }
});

router.patch("/:userId/privacy", async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({error: "authentication required. Log in first"});
  }

  try {
    const userId = req.params.userId;
    const {isPublic} = req.body;

    if (req.session.userId !== userId) {
      return res
        .status(403)
        .json({error: "cannot change other people's privacy"});
    }

    const currentProfile = await getUserProfile(userId);

    const updatedProfile = await updateUserProfile(userId, {
      bio: currentProfile.bio,
      isPublic: isPublic,
      profilePicture: currentProfile.profilePicture,
      favoriteGenres: currentProfile.favoriteGenres,
    });

    res.json({
      success: true,
      message: `profile is now ${isPublic ? "public" : "private"}`,
      profile: updatedProfile,
    });
  } catch (error) {
    console.log("error updating privacy of profile", error);
    res.status(500).json({error: "failed to update profile privacy"});
  }
});

module.exports = router;
