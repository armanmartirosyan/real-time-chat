import fs from "node:fs";
import path from "node:path";
import logger from "morgan";
import { Express } from "express";
import colors from "./colors";



export function loggerSetup(app: Express, env: string): void {
	try {
		if (!(env === "development" || env === "production"))
				throw new Error("configure the NODE_ENV variable.")
		const folderName: string = path.join(__dirname, "..", "logs");
		const fileName: string = path.join(folderName, `${env}.log`);
		if (!fs.existsSync(folderName)) {
			fs.mkdirSync(folderName);
			console.log(`${colors.cyan}Directory for storing logs created at ${folderName}${colors.reset}`);
		}
		app.use(logger("common", {
			stream: fs.createWriteStream(fileName, { flags: 'a' })
		}));
	}
	catch(error: any) {
		console.error(colors.red, error, colors.reset);
		process.exit(1);
	}
}