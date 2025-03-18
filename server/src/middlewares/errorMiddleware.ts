import mongoose from "mongoose";
import APIError from "../exceptions/apiError";
import MailError from "../exceptions/mailError";
import { NextFunction, Request, Response } from "express";
import { writeToErrorFile } from "../helpers/writeToFile";

export default function (err: Error, req: Request, res: Response, next: NextFunction): void {
	if (err instanceof mongoose.Error.ValidationError) {
		res.status(400).json({ message: err.message, errors: err.errors });
		return;
	}
	if (err instanceof mongoose.mongo.MongoServerError) {
		res.status(400).json({ message: "User already exist.", error: err.errorResponse.keyValue })
		return;
	}
	if (err instanceof APIError) {
		res.status(err.status).json({ message: err.message, errors: err.errors });
		return;
	}
	if (err instanceof MailError) {
		writeToErrorFile(err, err.message);
		res.status(err.status).json({ message: err.message });
		return;
	}
	writeToErrorFile(err, "Unexpected Error");
	res.status(500).json({ message: "Unexpected error." });
	return;
}
