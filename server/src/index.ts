import dotenv from "dotenv";
import mongoose from "mongoose";
import colors from "./helpers/colors.js";
import { loggerSetup } from "./helpers/loggerSetup.js";
import router from "./routes/routes.js"
import express, {Express, Request, Response} from "express";


dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

loggerSetup(app, process.env.NODE_ENV!);



app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Server something else" });
});

app.use("/api", router);

async function startServer(): Promise<void> {
	try {
		await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!)
		.then(() => {
			console.log(`${colors.cyan}MongoDB connected successfully${colors.reset}`);
		})
		.catch((error) => {
			console.error("MongoDB connection error:", error);
			process.exit(1);
		});
	
		app.listen(PORT, () => {
			console.log(`${colors.yellow}Server is running on port ${PORT}...${colors.reset}`);
		});
	} catch(error) {
		console.error(colors.red, error, colors.reset);
		process.exit(1);
	}
}

startServer();