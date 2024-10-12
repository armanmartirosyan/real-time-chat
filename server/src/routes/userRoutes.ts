import { Router, Request, Response  } from "express";
import UserController from "../controllers/userController.js";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.post("/registration", userController.registration.bind(userController));

export default userRoutes;
