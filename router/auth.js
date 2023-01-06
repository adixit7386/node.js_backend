const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const router = express.Router();

dotenv.config();

router.post("/register", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
  });
  try {
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(500).json("user not found");
      return;
    } else {
      try {
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
          res.status(500).json("incorrect password");
          return;
        }
        const { password, ...others } = user._doc;
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.SECRET_KEY,
          { expiresIn: "1y" }
        );

        res.json({ ...others, accessToken }).status(200);
        return;
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    res.status(500).json("incorrect username or password");
    return;
  }
});
module.exports = router;
