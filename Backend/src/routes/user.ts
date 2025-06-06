import express from 'express';
import {
    deleteUser,
    getAllUsers,
    getUser,
    loginUser,
    newUser,
    registerUser,
} from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Register new user "/api/v1/user/register"
router.post("/register", registerUser);

// login user "/api/v1/user/login
router.post("/login", loginUser);

//route "/api/v1/user/new"
router.post("/new", newUser);

//route "api/v1/user/all"
router.get("/all", isAdmin, getAllUsers);

//route "api/v1/user/dynamic :id"
router.route("/:id").get(getUser).delete(isAdmin, deleteUser);

export default router;
