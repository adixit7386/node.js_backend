const express = require("express");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../router/verifyToken.js");
const Cart = require("../models/Cart");
const router = express.Router();

//CREATE A CART
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE CART BY ID FOR ADMIN
router.put("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//DELETE PRODUCT BY ID FOR ADMIN
router.delete("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});
//FIND BY ID FOR ALL USERS
//here the id means for the user id

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    const findCart = await Cart.findOne({ userId: req.params.id });

    res.status(200).json(findCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//FIND ALL CARTS FOR ADMIN
router.get("/find", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const carts = await Cart.find();

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
