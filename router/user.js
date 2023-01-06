const express = require("express");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../router/verifyToken.js");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();
//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});
//deletebyid for admin and users
router.delete("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json("user deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});
//findbyid for admin
router.get("/find/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const findUser = await User.findById(req.user.id);
    const { password, ...others } = findUser._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
//findall for admin
router.get("/find", verifyTokenAndAdmin, async (req, res, next) => {
  const query = req.query.new;
  try {
    const findUsers = await User.find();
    // const { password, ...others } = findUser._doc;
    if (query) {
      const findUsers = await User.find().limit(5);
    } else {
      const findUsers = await User.find();
    }
    res.status(200).json(findUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user stats only for admin
router.get("/stats", verifyTokenAndAdmin, async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
