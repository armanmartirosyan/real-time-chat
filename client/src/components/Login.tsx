import "../@types/index.d";
import React, { ChangeEvent, useContext, useState } from "react";
import { UserContext, UserContextType } from "../contexts/userContext";
import { ApiResponse, IUserCredentials } from "../@types/index.d";

interface LoginProps {
	isLoginPage: boolean;
	setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({ isLoginPage, setIsLoginPage }: LoginProps): React.JSX.Element {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [generalError, setGeneralError] = useState<string>("");
	const [errors, setErrors] = useState<IUserCredentials>({
		email: "",
		password: "",
		username: "",
		passwordConfirm: "",
	});
	const userContext: UserContextType = useContext<UserContextType>(UserContext);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, handler: Function): void {
		if (generalError) {
			setGeneralError("");
		}
		setErrors((prev: IUserCredentials): IUserCredentials => ({
			...prev,
			[e.target.name]: "",
		}));
		handler(e.target.value);
	}

	function validateForm(): boolean {
		let isValid: boolean = true;
		const newErrors = { ...errors };
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			newErrors.email = "Please enter a valid email address";
			isValid = false;
		}
		if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters"
			isValid = false;
		}
		if (!isValid) {
			setEmail("");
			setPassword("");
		}
		setErrors(newErrors);
		return isValid
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();
		setGeneralError("");

		if (!validateForm()) {
			return;
		}
		try {
			setIsSubmitting(true);
			const response: ApiResponse = await userContext.login(email, password);

			if (response.errors && response.errors.length > 0) {
				setGeneralError(response.errors[0].message || "Registration failed. Please try again later.");
			}
		} catch (error: any) {
			console.error(error);
			setGeneralError("An error occurred. Please try again later.")
		} finally {
			setIsSubmitting(false);
			if (!generalError) {
				setEmail("");
				setPassword("");
			}
		}
	}

	function setAccount(e: React.MouseEvent<HTMLAnchorElement>): void {
		e.preventDefault();
		setIsLoginPage(!isLoginPage);
	}

	function getErrorMessage(field: string): string {
		if (errors[field]) {
			return errors[field];
		}
		return "";
	}

	return (
		<section>
			<div className="signin">
				<div className="content">
					<h2>Sign In</h2>
					{generalError && <div className="general-error">{generalError}</div>}
					<form className="root-form" onSubmit={handleSubmit}>
						<div className="input-box">
							<input
								type="email"
								required
								value={email}
								onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setEmail)}
								placeholder=" "
								autoComplete="email"
							/>
							{getErrorMessage("email") && <p className="error-message">{getErrorMessage("email")}</p>}
							<label>Email</label>
						</div>
						<div className="input-box">
							<input
								type="password"
								required
								value={password}
								onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setPassword)}
								placeholder=" "
								autoComplete="current-password"
							/>
							{getErrorMessage("password") && <p className="error-message">{getErrorMessage("password")}</p>}
							<label>Password</label>
						</div>
						<div className="links">
							<a href="#">Forgot password</a> <a onClick={setAccount}>Sign Up</a>
						</div>
						<div className="input-box form-submit-btn">
							<input type="submit" value="Login" />
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}