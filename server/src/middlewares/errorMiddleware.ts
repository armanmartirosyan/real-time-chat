import mongoose from "mongoose";
import APIError from "../exceptions/apiError";
import MailError from "../exceptions/mailError";
import { NextFunction, Request, Response } from "express";
import { writeToErrorFile } from "../helpers/writeToFile";

export default function (err: Error, req: Request, res: Response, next: NextFunction): void {
	if (err instanceof mongoose.Error.ValidationError) {
		res.status(400).json({ success: false, message: err.message, errors: err.errors });
		return;
	}
	if (err instanceof mongoose.mongo.MongoServerError) {
		res.status(400).json({ success: false, message: err.errorResponse.errmsg, error: err.errorResponse.keyValue })
		return;
	}
	if (err instanceof APIError) {
		res.status(err.status).json({ success: err.success, message: err.message, errors: err.errors });
		return;
	}
	if (err instanceof MailError) {
		writeToErrorFile(err, err.message);
		res.status(err.status).json({ success: err.success, message: err.message });
		return;
	}
	writeToErrorFile(err, "Unexpected Error");
	res.status(500).json({ success: false, message: "Internal Server Error" });
	return;
}
