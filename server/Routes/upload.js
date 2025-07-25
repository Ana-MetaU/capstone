const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_avatars",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    public_id: (req, file) => {
      // Customize the public ID if needed
      return `my_file_${Date.now()}`;
    },
  },
});

const upload = multer({storage: storage});

// Define a POST route for image upload
router.post("/profile-picture", upload.single("ProfilePicture"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.send({success: true, imageUrl: req.file.path});
});

module.exports = router;
