import errorHandler from "../Middlewares/error.js";
import { Order } from "../models/order.js";
import { myCache } from "../app.js";
import { reduceStock, revalidateCache } from "../utils/features.js";

export const newOrder = async (req, res, next) => {
    try {
        const user = req.user._id
        const { photo, name, quantity, size, discount, amount, status, productId } = req.body;
        await Order.create(
            { user, photo, name, quantity, size, discount, amount, status, productId }
        )
        await reduceStock({ productId, size, quantity })
        await revalidateCache({ order: true })
        res.status(200).json({
            success: true,
            message: "Order Placed Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const myOrders = async (req, res, next) => {
    try {
        const id = req.user._id;
        let orders = []
        const key = `my-orders-${id}`
        if (myCache.has(key)){
            orders = JSON.parse(myCache.get(key))
        } else {
            orders = await Order.find({user:id})
            myCache.set(key,JSON.stringify(orders))
        }
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        next(error)
    }
}

export const allOrders = async (req, res, next) => {
    try {
        let orders = []
        orders = await Order.find({})
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        next(error)
    }
}

export const singleOrder = async (req, res, next) => {
    try {
        const {id} = req.params
        let order = await Order.findById(id)
        if (!order) return new next(new errorHandler("Order doesn't exist",404))
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        next(error)
    }
}

export const deleteOrder = async (req, res, next) => {
    try {
        const {id} = req.params
        await Order.deleteOne({_id:id})
        await revalidateCache({order:true})
        res.status(200).json({
            success: true,
            message:"Order Cancelled Successfully"
        })
    } catch (error) {
        next(error)
    }
}
export const processOrder = async (req, res, next) => {
    try {
        const {id} = req.params
        let order = await Order.findById(id)
        if (order.status == "Processing") {
            order.status = "Shipped"
        } else if (order.status == "Shipped"){
            order.status = "Delivered"
        } else {
            order.status = "Delivered"
        }
        await order.save()
        await revalidateCache({order:true})
        res.status(200).json({
            success: true,
            message:"Order Updated Successfully"
        })
    } catch (error) {
        next(error)
    }
}
