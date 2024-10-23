class MailError extends Error{
	status: number;
	message: string;
	errors: any;

	constructor(status: number, message: string, errors: any = []) {
		super(message);
		this.status = status;
		this.message = message;
		this.errors = errors;
	}

	static ActivationMailError(errors: any): MailError {
		return new MailError(500, "Failed to send activation email", errors);
	}
}

export default MailError;