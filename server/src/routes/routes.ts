import { Router } from "express";
import userRoutes from "./userRoutes";
import chatRoutes from "./chatRoutes";

const router: Router = Router();

router.use("/user", userRoutes);
router.use("/chat", chatRoutes);


export default router;