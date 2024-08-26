import errorHandler from "../Middlewares/error.js";
import { Product } from "../models/product.js";
import { rm } from "fs"
import { myCache } from "../server.js";
import { revalidateCache } from "../utils/features.js";

export const newProduct = async (req, res, next) => {
    try {
        const { name, price, category, stock } = req.body;
        const photo = req.file

        if (!photo) return next(new errorHandler("Please enter Photo", 400))

        if (!name || !price || !category || !stock) {
            rm(photo.path, () => {
                console.log("Deleted")
            })
            return next(new errorHandler("Please enter All Fields", 400))
        }

        let product = await Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: photo?.path
        })

        await revalidateCache({product:true})

        if (!product) return next(new errorHandler("Product not created", 404))
        return res.status(201).json({
            successs: true,
            message: "Product created"
        })
    } catch (error) {
        next(error)
    }
}

export const getLatestProducts = async (req, res, next) => {
    try {
        let products;
        if (myCache.has("latest-products")) {
            products = JSON.parse(myCache.get("latest-products"))
        } else {
            products = await Product.find({}).sort({ createdAt: -1 }).limit(3)
            myCache.set("latest-products", JSON.stringify(products))
        }
        return res.status(200).json({
            successs: true,
            products
        })
    } catch (error) {
        next(error)
    }
}

export const getAdminProducts = async (req, res, next) => {
    try {
        let adminProducts;
        if (myCache.has("admin-products")) {
            adminProducts = JSON.parse(myCache.get("admin-products"))
        } else {
            adminProducts = await Product.find({})
            myCache.set("admin-products", JSON.stringify(adminProducts))
        }
        return res.status(200).json({
            successs: true,
            adminProducts
        })
    } catch (error) {
        next(error)
    }
}

export const getSingleProduct = async (req, res, next) => {
    try {
        let singleProduct;
        const id = req.params.id
        if (myCache.has(`single-${id}`)) {
            singleProduct = JSON.parse(myCache.get(`single-${id}`))
        } else {
            singleProduct = await Product.findById(id)
            myCache.set(`single-${id}`, JSON.stringify(singleProduct))
        }
        if (!singleProduct) return next(new errorHandler("Product not found", 404))
        return res.status(200).json({
            successs: true,
            singleProduct
        })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, price, category, stock } = req.body;
        const photo = req.file
        let product = await Product.findById(id)

        if (!product) return next(new errorHandler("PRODUCT NOT FOUND", 404))
        if (photo) {
            rm(product.photo, () => {
                console.log("Old Photo Deleted")
            })
            product.photo = photo.path
        }
        if (name) product.name = name
        if (price) product.price = price
        if (category) product.category = category
        if (stock) product.stock = stock

        await product.save()

        return res.status(200).json({
            successs: true,
            message: "Product Updated Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return next(new errorHandler("PRODUCT NOT FOUND", 404))
        await product.deleteOne()
        rm(product.photo, () => {
            console.log("Product Photo Deleted")
        })

        await revalidateCache({product:true})
        
        return res.status(200).json({
            successs: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        next(error)
    }
}

export const getAllCategory = async (req, res, next) => {
    try {
        let allCategory;
        if (myCache.has("categories")) {
            allCategory = JSON.parse(myCache.get("categories"))
        } else {
            allCategory = await Product.distinct("category")
            myCache.set("categories", JSON.stringify(allCategory))
        }
        res.status(200).json({
            success: true,
            allCategory
        })
    } catch (error) {
        next(error)
    }
}

export const getAllProducts = async (req, res, next) => {
    try {
        const { search, price, category, sort } = req.query
        
        const page = Number(req.query.page) || 1
        const limit = process.env.PRODUCT_PER_PAGE || 6
        const skip = (page - 1) * limit

        const baseQuery = {}

        if (search) {
            baseQuery.name = {
                $regex: search,
                $options: "i"
            }
        }
        if (price) {
            baseQuery.price = {
                $lte: Number(price)
            }
        }
        if (category) baseQuery.category = category.toLowerCase()

        const [products, filteredProductsOnly] = await Promise.all([
            sort?(Product.find(baseQuery).sort({price: sort === "asc" ? 1 : -1}).limit(limit).skip(skip)):(Product.find(baseQuery).limit(limit).skip(skip)),
            Product.find(baseQuery)
        ])

        const totalPage = Math.ceil(filteredProductsOnly.length / limit)
        res.status(200).json({
            success: true,
            products,
            totalPage
        })
    } catch (error) {
        next(error)
    }
}