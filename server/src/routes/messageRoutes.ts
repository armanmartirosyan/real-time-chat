import { Router } from "express";
import MessageController from "../controllers/messageController";
import authMiddleware from "../middlewares/authMiddleware";

const messageRoutes: Router = Router();
const messageController = new MessageController();

messageRoutes.post("/create", authMiddleware, messageController.createMessage.bind(messageController));
messageRoutes.get("/get/:chatId", authMiddleware, messageController.getMessages.bind(messageController));

export default messageRoutes;