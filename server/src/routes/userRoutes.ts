import { body } from "express-validator";
import { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import validatorMiddleware from "../middlewares/validatorMiddleware";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.post("/registration", validatorMiddleware, userController.registration.bind(userController));
userRoutes.post("/login", validatorMiddleware, userController.login.bind(userController));
userRoutes.post("/logout", userController.logout.bind(userController));
userRoutes.get("/activate/:link", userController.activate.bind(userController));
userRoutes.get("/refresh", userController.refresh.bind(userController));
userRoutes.get("/:username", authMiddleware, userController.getUser.bind(userController));
userRoutes.post("/avatar", authMiddleware, userController.uploadAvatar.bind(userController));
userRoutes.patch("/update", authMiddleware, userController.updateUser.bind(userController));


export default userRoutes;
