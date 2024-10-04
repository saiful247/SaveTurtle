import express from "express";
import { Purchase } from "../models/purchaseModel.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/purchasePayment/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
router.use('/uploads/purchasePayment/', express.static(path.join(path.resolve(), 'uploads/purchasePayment/')));

// Route for saving a new purchase with an image
router.post("/", upload.single('image'), async (request, response) => {
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
                message: "Send all required fields: customerName, email, phone, address, productName, quantity, productSize, productPrice, totalPrice",
            });
        }

        const paymentSlipUrl = request.file ? `/uploads/purchasePayment/${request.file.filename}` : null;

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

// Other routes (GET, PUT, DELETE) remain the same...

export default router;