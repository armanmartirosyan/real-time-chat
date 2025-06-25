
class ServiceError extends Error {
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

	static UnauthorizedError(): ServiceError {
		return new ServiceError(401, "User is not authorized.");
	}

	static BadRequest(message: string, errors: any = []): ServiceError {
		return new ServiceError(400, message, errors);
	}

	static NoContent(message: string, errors: any = []): ServiceError {
		return new ServiceError(404, message, errors);
	}
}

export default ServiceError;