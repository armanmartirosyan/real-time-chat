import { Router } from "express";
import userRoutes from "./userRoutes.js";

const router: Router = Router();

router.use("/user", userRoutes);


export default router;