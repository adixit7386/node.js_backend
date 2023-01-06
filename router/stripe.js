const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);
router.post("/payment", async (req, res, next) => {
  const customer = await stripe.paymentIntents.create(
    {
      amount: req.body.amount,
      payment_method_data: {
        type: "card",
        card: { token: req.body.tokenId.id },
      },
      currency: "inr",
      payment_method_types: ["card"],
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );

  //   console.log(customer.id);
});

module.exports = router;
