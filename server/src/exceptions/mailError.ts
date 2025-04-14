class MailError extends Error{
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

	static ActivationMailError(errors: any): MailError {
		return new MailError(500, "Failed to send activation email", errors);
	}
}

export default MailError;