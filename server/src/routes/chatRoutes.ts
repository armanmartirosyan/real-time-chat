import { Router } from "express";
import ChatController from "../controllers/chatController";
import authMiddleware from "../middlewares/authMiddleware";

const chatRoutes: Router = Router();
const chatController = new ChatController();

chatRoutes.post("/create", authMiddleware, chatController.createChat.bind(chatController));
chatRoutes.get("/get/:userId", authMiddleware, chatController.getAllChats.bind(chatController));
chatRoutes.get("/get", authMiddleware, chatController.getChat.bind(chatController));
chatRoutes.patch("/:chatId/name", authMiddleware, chatController.updateChatName.bind(chatController));

export default chatRoutes;