const express = require("express");
const multer = require("multer");
const router = express.Router();

// For handling file paths
// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to avoid collisions
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({storage: storage});

// Define a POST route for image upload
router.post("/profile-picture", upload.single("ProfilePicture"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const imageUrl = `http://localhost:3000/uploads/profile/${req.file.filename}`;
  res.send({success: true, imageUrl: imageUrl});
});

module.exports = router;
