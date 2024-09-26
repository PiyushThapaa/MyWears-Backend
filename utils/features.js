import jwt from "jsonwebtoken";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";

export const sendCookie = (user, res, message, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        sameSite:process.env.NODE_ENV === "development" ? "lax" : "none",
        secure:process.env.NODE_ENV === "development" ? "false" : "true"
    }).json({
        success: true,
        message: message
    })
}

export const revalidateCache = async ({ product, order }) => {
    if (product) {
        const productKeys = [
            "latest-products",
            "admin-products",
            "categories"
        ]

        const products = await Product.find({}).select("_id")
        products.forEach(i => {
            productKeys.push(`single-${i._id}`)
        })

        myCache.del(productKeys)
    }
    if (order) {
        const orderKeys = []
        const orders = await Order.find({}).select("user")
        console.log(orders)
        orders.forEach(i => {
            orderKeys.push(`my-orders-${i.user}`)
        })
        myCache.del(orderKeys)
    }
}

export const reduceStock = async ({productId, size, quantity}) => {
    const product = await Product.findById(productId)
    if (!product) throw new Error("Product not found")
    const productStock = JSON.parse(product.stock)
    productStock[size] -= quantity
    if (productStock["XS"]==0&&productStock["S"]==0&&productStock["M"]==0&&productStock["L"]==0&&productStock["XL"]==0&&productStock["XXL"]==0){
      return await product.deleteOne()
    }
    product.stock = JSON.stringify(productStock)
    await product.save()
}
