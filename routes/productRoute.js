import express from "express";
import {
    createProductPage,
    deleteProductById,
    getProductById,
    getProductByTitle,
    getTopProducts,
    getfilterProduct,
    getproductPage,
    updateProductById,
} from "../controller/productController.js";
import { checkAdmin } from "../middleware/auth.js";

const router = express.Router();

// Place the search route at the top to avoid conflicts with other routes
router.get("/search", getProductByTitle); // Search route
router.get("/", getproductPage);
router.get("/top", getTopProducts);
router.get("/filter", getfilterProduct);
router.post("/", checkAdmin, createProductPage);
router.put("/:id", checkAdmin, updateProductById);
router.get("/:id", getProductById);
router.delete("/delete/:id", checkAdmin, deleteProductById);

export default router;
