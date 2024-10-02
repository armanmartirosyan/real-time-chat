import express, {Express, Request, Response} from "express";

const app: Express = express();
const PORT: number = 8080;

app.get("/", (req: Request, res: Response) => {
	res.json({ message: "Server something else" });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});