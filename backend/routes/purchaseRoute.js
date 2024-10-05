import express from "express";
import { Purchase } from "../models/purchaseModel.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/purchasePayment/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
router.use(
  "/uploads/purchasePayment/",
  express.static(path.join(path.resolve(), "uploads/purchasePayment/"))
);

// Route for saving a new purchase with an image
router.post("/", upload.single("image"), async (request, response) => {
  try {
    if (
      !request.body.customerName ||
      !request.body.email ||
      !request.body.phone ||
      !request.body.address ||
      !request.body.productName ||
      !request.body.quantity ||
      !request.body.productSize ||
      !request.body.productPrice ||
      !request.body.totalPrice
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: customerName, email, phone, address, productName, quantity, productSize, productPrice, totalPrice",
      });
    }

    const paymentSlipUrl = request.file
      ? `/uploads/purchasePayment/${request.file.filename}`
      : null;

    // Automatically capture the current date as the purchaseDate
    const purchaseDate = new Date();

    const newPurchase = {
      customerName: request.body.customerName,
      email: request.body.email,
      phone: request.body.phone,
      address: request.body.address,
      productName: request.body.productName,
      quantity: request.body.quantity,
      productSize: request.body.productSize,
      productPrice: request.body.productPrice,
      totalPrice: request.body.totalPrice,
      paymentSlipUrl,
      purchaseDate,
    };

    const purchase = await Purchase.create(newPurchase);
    return response.status(201).send(purchase);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for getting all purchases
router.get("/", async (request, response) => {
  try {
    const purchases = await Purchase.find({});
    return response.status(200).json({
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for getting a purchase by ID
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return response.status(404).json({ message: "Purchase not found" });
    }
    return response.status(200).json(purchase);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for updating a purchase (with image update)
router.put("/:id", upload.single("paymentImage"), async (request, response) => {
  try {
    if (
      !request.body.customerName ||
      !request.body.email ||
      !request.body.phone ||
      !request.body.address ||
      !request.body.productName ||
      !request.body.quantity ||
      !request.body.productSize ||
      !request.body.productPrice ||
      !request.body.totalPrice
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: customerName, email, phone, address, productName, quantity, productSize, productPrice, totalPrice",
      });
    }

    const { id } = request.params;
    const paymentSlipUrl = request.file
      ? `/uploads/purchasePayment/${request.file.filename}`
      : request.body.paymentSlipUrl;

    const updatedPurchase = {
      ...request.body,
      paymentSlipUrl,
    };

    const result = await Purchase.findByIdAndUpdate(id, updatedPurchase, {
      new: true,
    });

    if (!result) {
      return response.status(404).json({ message: "Purchase not found" });
    }

    return response.status(200).send({
      message: "Purchase updated successfully",
      purchase: result,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for deleting a purchase
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Purchase.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Purchase not found" });
    }

    return response
      .status(200)
      .send({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
