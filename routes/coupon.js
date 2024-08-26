import express from "express";
import { adminOnly } from "../Middlewares/adminOnly.js";
import { allCoupon, deleteCoupon, newCoupon, verifyCoupon } from "../controllers/coupon.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();

// route : /api/vl/coupons/

router.post("/new",isAuthenticated,adminOnly,newCoupon)
router.get("/all",isAuthenticated,adminOnly,allCoupon)

// Applying Coupon
router.post("/verify",verifyCoupon)

router.route("/:id")
.delete(isAuthenticated,adminOnly,deleteCoupon)

export default router;