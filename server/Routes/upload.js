const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../cloudinary.js");
const fs = require("fs");

const upload = multer({dest: "tmp/"});

router.post(
  "/profile-picture",
  upload.single("ProfilePicture"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pictures",
      });

      fs.unlinkSync(req.file.path); // remove temp file

      res.send({success: true, imageUrl: result.secure_url});
    } catch (error) {
      res.status(500).send("Cloudinary upload failed.");
    }
  }
);

module.exports = router;
