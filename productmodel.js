import express from "express";
import mongoose from "mongoose";
import Product from '../models/product.js';
// import { getproduct, postproduct, updateproduct, deleteproduct } from "../controllers/productcontroller.js";
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allproducts = await Product.find({});
        res.status(200).json({ success: true, data: allproducts });
    } catch (error) {
        console.log("Error in fetching data:", error.message);
        res.status(500).json({ success: false, message: "Error fetching products." });
    }
});

router.post('/', async (req, res) => {
    const productData = req.body;

    // Validate the incoming product data
    if (!productData.name || !productData.price || !productData.Image) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newProduct = new Product(productData); // Use Product constructor

    try {
        await newProduct.save(); // Save the new product
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error while creating product", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.put('/:id', async (req, res, next) => {
    let { id } = req.params;
    id = id.trim();
    const product = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error.message);
        next(error); // Pass the error to the next middleware
    }
});

router.delete('/:id', async (req, res, next) => {
    let { id } = req.params;
    id = id.trim();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        next(error); // Pass the error to the next middleware
    }
});

export default router;
