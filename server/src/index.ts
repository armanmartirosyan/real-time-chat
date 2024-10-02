import dotenv from "dotenv";
import mongoose from "mongoose";
import express, {Express, Request, Response} from "express";

dotenv.config();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 8080;

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!)
.then(() => {
	console.log("MongoDB connected successfully");
})
.catch((error) => {
	console.error('MongoDB connection error:', error);
	process.exit(1);
});


app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Server something else" });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});