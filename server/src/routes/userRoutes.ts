import { Router, Request, Response  } from "express";
import UserController from "../controllers/userController.js";
import { body } from "express-validator";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.post("/registration",
	body("email").isEmail(),
	body("username").isLength({ min: 3, max: 25 }),
	body("password").isLength({ min: 3, max: 64 }),
	body("passwordConfirm").isLength({ min: 3, max: 64 }),
	userController.registration.bind(userController)
);



export default userRoutes;
