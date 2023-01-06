const express = require("express");
const userRouter = require("./router/user");
const cartRouter = require("./router/cart");
const orderRouter = require("./router/order");
const productRouter = require("./router/product");
const authRouter = require("./router/auth");
const stripeRouter = require("./router/stripe");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successfully..."))
  .catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("app working fine");
});
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/checkout", stripeRouter);

const APP_PORT = process.env.APP_PORT || 5000;

app.listen(APP_PORT, () => {
  console.log(`app is running on the port ${APP_PORT}`);
});
