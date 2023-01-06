const express = require("express");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../router/verifyToken.js");
const Order = require("../models/Order");

const router = express.Router();

//CREATE AN ORDER
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    res.status(200).json(savedOrder);
  } catch (err) {
    console.log("error here");
    res.status(500).json(err);
  }
});

//UPDATE ORDER BY ID FOR ADMIN
router.put("/:id", verifyToken, async (req, res, next) => {
  console.log(req.body);
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});
//DELETE ORDERS BY ID FOR ADMIN
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});
//FIND BY ID FOR ALL USERS
//here the id means for the user id

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    const findOrder = await Order.find({ userId: req.params.id });

    res.status(200).json(findOrder);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});
//FIND ALL ORDERS WITH A CONDITION
router.get("/find", verifyToken, async (req, res, next) => {
  // console.log("requset", req.body);
  try {
    const Orders = await Order.find(req.body.userId);

    res.status(200).json(Orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res, next) => {
  console.log("request here");
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: previousMonth } },
      },
      {
        $project: { month: { $month: "$createdAt" }, sales: "$amount" },
      },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
