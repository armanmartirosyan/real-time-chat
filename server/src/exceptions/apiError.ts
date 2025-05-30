class APIError extends Error {
	status: number;
	success: boolean;
	message: string;
	errors: any;

	constructor(status: number, message: string, errors: any = []) {
		super(message);
		this.status = status;
		this.message = message;
		this.errors = errors;
		this.success = false;
	}

	static UnauthorizedError(): APIError {
		return new APIError(401, "User is not authorized.");
	}

	static BadRequest(message: string, errors: any = []): APIError {
		return new APIError(400, message, errors);
	}

	static NoContent(message: string, errors: any = []): APIError {
		return new APIError(404, message, errors);
	}
}

export default APIError;