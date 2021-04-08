const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const emailValidator = require("email-validator");
const config = require("config");
const functions = require("../functions");

const User = require("../models/User");
const auth = require("../middleware/auth");

const multer = require("multer");
const url = config.get("mongoURI");
const GridFSBucket = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { createConnection } = require("mongoose");

const conn = createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const crypto = require("crypto");
const path = require("path");

const storage = new GridFSBucket({
  url: url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

//get a user
router.get("/", auth, async (req, res) => {
  const id = req.user.id;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "Invalid user" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

//get avatar
router.get("/avatar/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      gfs.files.findOne({ _id: mongoose.Types.ObjectId(id) }, (err, file) => {
        if (!file || file.length === 0) {
          avatar = null;
        }

        if (file) {
          if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png" ||
            file.contentType === "image/jpg"
          ) {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
          }
        } else {
          res.status(400).json({ msg: "Not an uploaded image" });
        }
      });
    } else {
      res.status(400).json({ msg: "Not an uploaded image" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "server error" });
  }
});

//update a user
router.put("/", auth, upload.single("avatar"), async (req, res) => {
  const id = req.user.id;
  const { username, bio, phone, email, password, type } = JSON.parse(
    req.body.data
  );

  try {
    const userData = await User.findById(id);
    const update = {};
    if (username) update.username = username;
    if (bio) update.bio = bio;
    if (phone) update.phone = phone;

    if (!type) {
      if (email) update.email = email;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(password, salt);
      }
    } else {
      if (type === "github") {
        update.github = { id: userData.github.id };
        if (email) update.github.email = email;
      } else if (type === "google") {
        update.google = { id: userData.google.id };
        if (email) update.google.email = email;
      }
    }

    if (req.file) {
      if (
        req.file.contentType === "image/jpeg" ||
        req.file.contentType === "image/png" ||
        req.file.contentType === "image/jpg"
      ) {
        if (userData.avatar && functions.isObjId(userData.avatar)) {
          gfs.remove(
            { _id: userData.avatar, root: "uploads" },
            (err, gridStore) => {
              if (err) {
                res.status(400).json({ err });
              }
            }
          );
        }
        update.avatar = req.file.id;
      }
    }

    if (password && password.length < 6) {
      res.status(400).json({ msg: "Min password length: 6" });
    }
    if (email && !emailValidator.validate(email)) {
      res.status(400).json({ msg: "Invalid Email" });
    }

    await User.findByIdAndUpdate(id, { $set: update }, { new: true });

    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
