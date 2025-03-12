import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/routes";
import colors from "./helpers/colors";
import cookieParser from "cookie-parser";
import { loggerSetup } from "./helpers/loggerSetup";
import express, {Express, Request, Response} from "express";
import errorMiddleware from "./middlewares/errorMiddleware";

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

loggerSetup(app, process.env.NODE_ENV!);

app.use(express.json());
app.use(cookieParser());
app.use(cors( {
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.use("/api", router);
app.use(errorMiddleware);

async function startServer(): Promise<void> {
	try {
		await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!)
		.then((): void => {
			console.log(`${colors.cyan}MongoDB connected successfully${colors.reset}`);
		})
		.catch((error: any): never => {
			console.error("MongoDB connection error:", error);
			process.exit(1);
		});
	
		app.listen(PORT, (): void => {
			console.log(`${colors.yellow}Server is running on port ${PORT}...${colors.reset}`);
		});
	} catch(error) {
		console.error(colors.red, error, colors.reset);
		process.exit(1);
	}
}

startServer();