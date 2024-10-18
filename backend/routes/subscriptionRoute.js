import express from "express";
import { Subscription } from "../models/subscriptionModel.js";
import multer from "multer";
import path from "path";
import router from "./eventRoute.js";

const SubscriptionRouter = express.Router();

// Setup for image upload (payment slip)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/subscriptions"); // Path where files are stored
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.use(
  "uploads/subscriptions",
  express.static(path.join(path.resolve(), "uploads/subscriptions"))
);

// Subscribe to a membership package
SubscriptionRouter.post(
  "/subscribe",
  upload.single("paymentSlip"),
  async (request, response) => {
    try {
      const { userId, firstName, lastName, email, membershipId } = request.body;

      const newSubscription = {
        userId,
        firstName,
        lastName,
        email,
        membershipId,
        paymentSlip: request.file.path, // Store payment slip image path
        status: "pending", // Set initial status to pending
      };

      const subscription = await Subscription.create(newSubscription);
      return response
        .status(201)
        .json({ message: "Subscription successful", data: subscription });
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: error.message });
    }
    const paymentImageUrl = request.file
      ? `/uploads/eventPayment/${request.file.filename}`
      : null;
  }
);

// View All Subscriptions
SubscriptionRouter.get("/subscriptions", async (request, response) => {
  try {
    const subscriptions = await Subscription.find(); // Retrieve all subscriptions
    return response.status(200).json(subscriptions); // Send the list of subscriptions
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// View subscription by ID
SubscriptionRouter.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return response.status(404).send({ message: "Subscription not found" });
    }

    return response.status(200).json(subscription);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Set Status to approved or disaapproved
SubscriptionRouter.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!subscription) {
      return response.status(404).send({ message: "Subscription not found" });
    }

    return response.status(200).json(subscription);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default SubscriptionRouter;
