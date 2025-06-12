import "../index.css";
import React, { ChangeEvent, useContext, useState } from "react";
import { UserContext, UserContextType } from "../contexts/userContext";
import { ApiResponse, IUserCredentials } from "../@types/index.d";

interface SignupProps {
	isLoginPage: boolean;
	setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Signup({ isLoginPage, setIsLoginPage }: SignupProps): React.JSX.Element {
	const [email, setEmail] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
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

		if (username.trim().length < 4) {
			newErrors.username = "Username must be at least 3 characters";
			isValid = false;
			setUsername("");
		}
		if (!emailRegex.test(email)) {
			newErrors.email = "Please enter a valid email address";
			isValid = false;
			setEmail("");
		}
		if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
			isValid = false;
			setEmail("");
		}
		if (password !== passwordConfirm) {
			newErrors.passwordConfirm = "Passwords do not match";
			isValid = false;
			setPassword("");
			setPasswordConfirm("");
		}
		setErrors(newErrors);
		return isValid;
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();
		setGeneralError("");

		if (!validateForm()) {
			return;
		}
		try {
			setIsSubmitting(true);
			const response: ApiResponse = await userContext.registration(email, username, password, passwordConfirm);

			if (response.success) {
				setIsLoginPage(true);
			}
			else if (response.errors && response.errors.length > 0) {
				setGeneralError(response.errors[0].message || "Registration failed. Please try again later.");
			}
		} catch (error: any) {
			console.error(error);
			setGeneralError("An error occurred. Please try again later.");
		} finally {
			setIsSubmitting(false);
			if (!generalError) {
				setEmail("");
				setUsername("");
				setPassword("");
				setPasswordConfirm("");
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
					<h2>Sign Up</h2>
					{generalError && <div className="general-error">{generalError}</div>}
					<form className="root-form" onSubmit={handleSubmit}>
						<div className="input-box">
							<input
								type="text"
								id="username"
								name="username"
								required
								value={username}
								onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setUsername)}
								placeholder=" "
								className={getErrorMessage("username") ? "input-error" : ""}
								autoComplete="username"
								disabled={isSubmitting}
							/>
							{getErrorMessage("username") && <p className="error-message">{getErrorMessage("username")}</p>}
							<label>Username</label>
						</div>
						<div className="input-box">
							<input
								type="email"
								id="email"
								name="email"
								required
								value={email}
								onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setEmail)}
								className={getErrorMessage("username") ? "input-error" : ""}
								placeholder=" "
								autoComplete="username"
							/>
							{getErrorMessage("email") && <p className="error-message">{getErrorMessage("email")}</p>}
							<label>Email</label>
						</div>
						<div className="input-box">
							<input
								type="password"
								id="password"
								name="password"
								required
								value={password}
								onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setPassword)}
								className={getErrorMessage("password") ? "input-error" : ""}
								placeholder=" "
								autoComplete="current-password"
							/>
							{getErrorMessage("password") && <p className="error-message">{getErrorMessage("password")}</p>}
							<label>Password</label>
						</div>
						<div className="input-box">
							<input
								type="password"
								id="passwordConfirm"
								name="passwordConfirm"
								required
								value={passwordConfirm}
								onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setPasswordConfirm)}
								className={getErrorMessage("passwordConfirm") ? "input-error" : ""}
								placeholder=" "
								autoComplete="current-password"
							/>
							{getErrorMessage("passwordConfirm") && <p className="error-message">{getErrorMessage("passwordConfirm")}</p>}
							<label>Confirm Password</label>
						</div>
						<div className="links">
							<a href="#">Forgot password</a> <a onClick={setAccount}>Sign In</a>
						</div>
						<div className="input-box form-submit-btn">
							<input type="submit" value="Signup" />
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}