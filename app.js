import express from "express";
import cors from "cors";
import NodeCache from "node-cache";
import { config } from "dotenv";
import { connectDB } from "./data/database.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

//Importing Routes
import userRouter from "./routes/user.js"
import orderRouter from "./routes/order.js"
import productRouter from "./routes/product.js"
import couponRouter from "./routes/coupon.js"
import { errorMiddleware } from "./Middlewares/error.js";

config({
    path: "./data/config.env"
})

const app = express();

const allowedOrigin = [process.env.FRONTEND_URL];

//Using Middlewares
app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigin.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true // Allow credentials
  }))

app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

//Using Middlewares
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

// Using Routes Middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/coupons",couponRouter);


connectDB();

export const myCache = new NodeCache()

app.get('/', (req, res) => {
    res.send("Working")
})

app.use("/uploads",express.static("uploads"))

app.use(errorMiddleware)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})