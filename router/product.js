const express = require("express");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../router/verifyToken.js");
const Product = require("../models/Product");
const router = express.Router();

//CREATE A PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE PRODUCT BY ID FOR ADMIN
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedUser = await Product.findByIdAndUpdate(
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
//DELETE PRODUCT BY ID FOR ADMIN
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});
//FIND BY ID FOR ALL USERS
router.get("/find/:id", async (req, res, next) => {
  try {
    const findProduct = await Product.findById(req.params.id);

    res.status(200).json(findProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
//FIND ALL PRODUCTS FOR ALL USERS
router.get("/find", async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
