import express from "express";
import { deleteProduct, getAdminProducts, getAllCategory, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../Middlewares/multer.js";
import { adminOnly } from "../Middlewares/adminOnly.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();

// route : /api/vl/products/

// Create Product
router.post("/new",isAuthenticated,adminOnly,singleUpload,newProduct)

// To get latest products
router.get("/latest",getLatestProducts)

// To get filtered products
router.get("/all",getAllProducts)

// To get all categories
router.get("/all-categories",getAllCategory)

// To get all products to use for admin
router.get("/admin-products",isAuthenticated,adminOnly,getAdminProducts)

// Single product and update & delete that product
router.route("/:id")
.get(getSingleProduct)
.put(isAuthenticated,adminOnly, singleUpload,updateProduct)
.delete(isAuthenticated,adminOnly, deleteProduct)

export default router;