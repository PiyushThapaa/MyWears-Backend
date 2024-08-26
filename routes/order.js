import express from "express";
import { allOrders, deleteOrder, myOrders, newOrder, processOrder, singleOrder } from "../controllers/order.js";
import { isAuthenticated } from "../Middlewares/auth.js";
import { adminOnly } from "../Middlewares/adminOnly.js";

const router = express.Router();

// route : /api/vl/orders/

router.post("/new",isAuthenticated,newOrder)

router.get("/my",isAuthenticated,myOrders)

router.get("/all",isAuthenticated,adminOnly,allOrders)

router.route('/:id')
.get(isAuthenticated,singleOrder)
.put(isAuthenticated,adminOnly,processOrder)
.delete(isAuthenticated,adminOnly,deleteOrder)

export default router;