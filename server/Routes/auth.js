const express = require("express");
const bcrypt = require("bcrypt");
const {
  createUser,
  checkUserExists,
  getUserByUsername,
  verifyUserPassword,
  getUserById,
} = require("../database/userUtils");
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

    console.log("new user from auth", newUser);

    res.status(201).json({message: "Signup successful!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Something went wrong during signup"});
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const {username, password} = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({error: "Username and password are required"});
    }

    user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).json({error: "Invalid username or password"});
    }

    validPassword = await verifyUserPassword(username, password);
    if (!validPassword) {
      return res.status(401).json({error: "Invalid username or password"});
    }

    // Store user ID and username in the session
    req.session.userId = user.id;
    req.session.username = user.username;

    res.json({id: user.id, username: user.username}); // Include id and username in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Something went wrong during login"});
  }
});

// // Logout Route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({error: "Failed to log out"});
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.json({message: "Logout successful"});
  });
});

router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({message: "Not logged in"});
  }

  try {
    const user = getUserById(req.session.userId);
    res.json({id: req.session.userId, username: user.username});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Error fetching user session data"});
  }
});

module.exports = router;
