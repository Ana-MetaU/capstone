const express = require("express");
const bcrypt = require("bcrypt");
const {createUser, checkUserExists} = require("../database/userUtils");
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const {username, password, email} = req.body;

  try {
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({error: "Username, password, and email are required."});
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({error: "Password must be at least 8 characters long."});
    }

    // Check if username is already taken
    const userExists = await checkUserExists(username, email);
    console.log("haha", userExists);
    if (userExists) {
      return res
        .status(400)
        .json({error: "Username already exists. Log in instead."});
    }

    // Hash the password before storing it
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await createUser({
      username,
      passwordHash,
      email,
    });

    console.log("new user from auth",newUser)

    res.status(201).json({message: "Signup successful!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Something went wrong during signup"});
  }
});

module.exports = router;
