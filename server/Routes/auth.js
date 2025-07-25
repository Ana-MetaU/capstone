const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {SUCCESS, USER_NOT_FOUND} = require("../database/constants.js");
const {
  createUser,
  checkUserExists,
  getUserByUsername,
  verifyUserPassword,
  getUserById,
} = require("../database/userUtils");

// Helper function for input validation
//Params: input objects {username, password, email?}, requireEmail (bollean)
// Returns: Error message(string) or 0 (number) if success
const validateInput = (input, requireEmail = false) => {
  const {username, password, email} = input;
  if (!username || !password) {
    return "Username and password are required";
  }

  if (requireEmail && !email) {
    return "Username, password, and email are required";
  }

  if (password.length < 8) {
    return "password msut be at least 8 characters long";
  }

  return SUCCESS;
};

// Signup Route
router.post("/signup", async (req, res) => {
  const {username, password, email} = req.body;

  try {
    const validInput = validateInput({username, password, email}, true);
    if (validInput !== SUCCESS) {
      return res.status(400).json({error: validInput});
    }

    // Check if username is already taken
    const userExists = await checkUserExists(username, email);
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
    // validate input
    const validInput = validateInput({username, password});
    if (validInput !== SUCCESS) {
      return res.status(400).json({error: validateInput});
    }

    // verify username
    const user = await getUserByUsername(username);
    if (user === USER_NOT_FOUND) {
      return res.status(401).json({error: "Invalid username"});
    }

    // verify password
    const isValidPassword = await verifyUserPassword(username, password);
    if (!isValidPassword) {
      return res.status(401).json({error: "Invalid password"});
    }

    // Store user ID and username in the session
    req.session.userId = user.id;
    req.session.username = user.username;

    // Cite: google gemini
    req.session.save((err) => {
      if (err) {
        console.error("Failed to save session:", err);
        return res.status(500).json({error: "Session save error"});
      }
      res.json({id: user.id, username: user.username});
    });
    console.log("Session after save:", req.session);
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
  console.log("Session ID:", req.sessionID);
  console.log("Session userId:", req.session.userId);

  if (!req.session.userId) {
    return res.status(401).json({message: "Not logged in"});
  }

  try {
    const user = await getUserById(req.session.userId);
    res.json({id: req.session.userId, username: req.session.username});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Error fetching user session data"});
  }
});

module.exports = router;
