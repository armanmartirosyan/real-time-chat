import { body } from "express-validator";
import { Router, Request, Response  } from "express";
import UserController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const userRoutes: Router = Router();
const userController = new UserController();

userRoutes.post("/registration",
	body("email").isEmail(),
	body("username").isLength({ min: 3, max: 25 }),
	body("password").isLength({ min: 3, max: 64 }),
	body("passwordConfirm").isLength({ min: 3, max: 64 }),
	userController.registration.bind(userController)
);
userRoutes.post("/login", userController.login.bind(userController));
userRoutes.post("/logout", userController.logout.bind(userController));
userRoutes.get("/activate/:link", userController.activate.bind(userController));
userRoutes.get("/refresh", userController.refresh.bind(userController));
userRoutes.get("/:username", authMiddleware, userController.getUser.bind(userController));
userRoutes.post("/avatar", authMiddleware, userController.uploadAvatar.bind(userController));



export default userRoutes;
