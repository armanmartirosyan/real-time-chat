import fs from "node:fs";
import path from "node:path";
import colors from "./colors";

export function writeToErrorFile(err: Error, info: string) {
	console.log(`${colors.red}${info}: Check './logs/error.log' for details.${colors.reset}`);
	fs.appendFile(path.join(__dirname, "..", "logs", "error.log"), `${new Date().toISOString()}: ${err.stack}\n\n`, (error) => {
		if (error)
			console.error('Error logging to error.log:', error);
	});
}
