import { IUserDTO, IUserFormData, ApiResponse, ApiError } from "../@types";
import React, { useContext, useState } from "react";
import { UserContext, UserContextType } from "../contexts/userContext";

interface UserProfileProps {
	user: IUserDTO;
}



export default function UserProfile({ user }: UserProfileProps): React.JSX.Element {
	const userContext: UserContextType = useContext<UserContextType>(UserContext);
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [formData, setFormData] = useState<IUserFormData>({
		username: user.username,
		email: user.email,
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<IUserFormData>({
		username: "",
		email: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [generalError, setGeneralError] = useState<string>("");

	function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value } = e.target;
		setFormData((prev: IUserFormData): IUserFormData => ({
			...prev,
			[name]: value,
		}));

		if (errors[name as keyof typeof errors]) {
			setErrors((prev: IUserFormData): IUserFormData => ({
				...prev,
				[name]: "",
			}));
		}

		if (generalError) {
			setGeneralError("");
		}
	}

	function validateForm(): boolean {
		let isValid: boolean = true;
		const newErrors = { ...errors };

		if (formData.username.trim().length < 3) {
			newErrors.username = "Username must be at least 3 characters";
			isValid = false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
			isValid = false;
		}

		if (formData.newPassword) {
			if (!formData.currentPassword) {
				newErrors.currentPassword = "Current password is required";
				isValid = false;
			}

			if (formData.newPassword.length < 8) {
				newErrors.newPassword = "Password must be at least 8 characters";
				isValid = false;
			}

			if (formData.newPassword !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match";
				isValid = false;
			}
		}

		setErrors(newErrors);
		return isValid;
	}

	async function handleSubmit(e: React.FormEvent): Promise<void> {
		e.preventDefault()
		setGeneralError("");

		if (!validateForm()) {
			return;
		}
		try {
			setIsSubmitting(true);
			const response: ApiResponse = await userContext.updateUser(formData);

			if (response.success) {
				user.email = formData.email;
				user.username = formData.username;

				setIsEditing(false);
				setFormData((prev: IUserFormData): IUserFormData => ({
					...prev,
					currentPassword: "",
					newPassword: "",
					confirmPassword: "",
				}));
			} else if (response.errors && response.errors.length > 0) {
				setErrors((prev: IUserFormData): IUserFormData => ({
					...prev,
					[response.errors![0].field]: `${response.errors![0].message}`,
				}));
				if (response.errors.length > 0) {
					const firstErrorField: string = response.errors[0].field;
					const element: HTMLElement | null = document.getElementById(firstErrorField);
					if (element) {
						element.scrollIntoView({ behavior: "smooth", block: "center" });
						element.focus();
					}
				}
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			setGeneralError("An unexpected error occurred. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	}

	function handleCancel(): void {
		setIsEditing(false)
		setFormData({
			username: user.username,
			email: user.email,
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
		setErrors({
			username: "",
			email: "",
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
		setGeneralError("");
	}

	function getErrorMessage(field: string): string {
		if (errors[field]) {
			return errors[field];
		}
		return "";
	}

	return (
		<div className="user-profile-container">
			<div className="user-profile-card">
				<div className="user-image-container">
					<img
						src={user.userImage || "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small_2x/default-avatar-photo-placeholder-profile-picture-vector.jpg"}
						alt={`${user.username}'s profile`}
						className="user-image"
					/>
					{user.isValid && (
						<span className="verification-badge" title="Verified User">
							✓
						</span>
					)}
				</div>

				<div className="user-info">
					{!isEditing ? (
						// View Mode
						<>
							<h2 className="username">{user.username}</h2>
							<p className="email">{user.email}</p>
							<div className="status-indicator">
								<span className={`status-dot ${user.isValid ? "valid" : "invalid"}`}></span>
								<span className="status-text">{user.isValid ? "Active Account" : "Inactive Account"}</span>
							</div>
							<button className="edit-button" onClick={(): void => setIsEditing(true)}>
								Edit Profile
							</button>
						</>
					) : (
						// Edit Mode
						<form onSubmit={handleSubmit} className="edit-form">
							<h2 className="form-title">Edit Profile</h2>

							{generalError && <div className="general-error">{generalError}</div>}

							<div className="form-group">
								<label htmlFor="username">Username</label>
								<input
									type="text"
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									className={getErrorMessage("username") ? "input-error" : ""}
									disabled={isSubmitting}
								/>
								{getErrorMessage("username") && <p className="error-message">{getErrorMessage("username")}</p>}
							</div>

							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className={getErrorMessage("email") ? "input-error" : ""}
									disabled={isSubmitting}
								/>
								{getErrorMessage("email") && <p className="error-message">{getErrorMessage("email")}</p>}
							</div>

							<div className="password-section">
								<h3>Change Password</h3>
								<div className="form-group">
									<label htmlFor="currentPassword">Current Password</label>
									<input
										type="password"
										id="currentPassword"
										name="currentPassword"
										value={formData.currentPassword}
										onChange={handleChange}
										className={getErrorMessage("currentPassword") ? "input-error" : ""}
										disabled={isSubmitting}
									/>
									{getErrorMessage("currentPassword") && (
										<p className="error-message">{getErrorMessage("currentPassword")}</p>
									)}
								</div>

								<div className="form-group">
									<label htmlFor="newPassword">New Password</label>
									<input
										type="password"
										id="newPassword"
										name="newPassword"
										value={formData.newPassword}
										onChange={handleChange}
										className={getErrorMessage("newPassword") ? "input-error" : ""}
										disabled={isSubmitting}
									/>
									{getErrorMessage("newPassword") && <p className="error-message">{getErrorMessage("newPassword")}</p>}
								</div>

								<div className="form-group">
									<label htmlFor="confirmPassword">Confirm Password</label>
									<input
										type="password"
										id="confirmPassword"
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										className={getErrorMessage("confirmPassword") ? "input-error" : ""}
										disabled={isSubmitting}
									/>
									{getErrorMessage("confirmPassword") && (
										<p className="error-message">{getErrorMessage("confirmPassword")}</p>
									)}
								</div>
							</div>

							<div className="form-actions">
								<button type="button" className="cancel-button" onClick={handleCancel} disabled={isSubmitting}>
									Cancel
								</button>
								<button type="submit" className="save-button" disabled={isSubmitting}>
									{isSubmitting ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}