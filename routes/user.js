import express from "express";
import { getAllUsers, getUser, getUserForAdmin, login, logout, register} from "../controllers/user.js";
import { adminOnly } from "../Middlewares/adminOnly.js";
import { isAuthenticated } from "../Middlewares/auth.js";

const router = express.Router();


// User route : /api/vl/users/
router.post('/login',login)

router.post('/new',register)

router.get("/logout",isAuthenticated,logout)

router.get('/all',isAuthenticated,adminOnly,getAllUsers)

// route : /api/vl/users/me
router.get("/me",isAuthenticated,getUser)

router.route('/:id').get(isAuthenticated,adminOnly,getUserForAdmin)

export default router;