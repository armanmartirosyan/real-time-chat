import { Router } from "express";
import userRoutes from "./userRoutes";
import chatRoutes from "./chatRoutes";
import messageRoutes from "./messageRoutes";

const router: Router = Router();

router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/msg", messageRoutes);


export default router;