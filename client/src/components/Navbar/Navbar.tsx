import React, { RefObject, useRef, useEffect, useState, useContext } from "react";
import classes from "./Navbar.module.css";
import { UserContext, UserContextType } from "../../contexts/userContext";

interface NavbarProps {
	setIsInfoPage: React.Dispatch<React.SetStateAction<boolean>>,
};

const Navbar: React.FC<NavbarProps> = ({ setIsInfoPage }: NavbarProps): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
	const userContext: UserContextType = useContext(UserContext);

	function toggleDropdown(): void {
		setIsOpen(!isOpen);
	}

	function getUserInitials(): string {
		return userContext.user.username
			.split(" ")
			.map((name: string): string => name[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}

	useEffect((): () => void => {
		function handleClickOutside(event: MouseEvent): void {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return (): void => {
			document.removeEventListener("mousedown", handleClickOutside);
		}
	}, []);

	function handleKeyDown(e: React.KeyboardEvent): void {
		if (e.key === "Escape") {
			setIsOpen(false);
		}
	}

	return (
		<nav className={classes["navbar"]}>
			<ul className={classes["navbar-list"]}>
				<li className={classes["navbar-item"]}>
					<div className={classes["dropdown"]} ref={dropdownRef} onKeyDown={handleKeyDown}>
						<button
							className={classes["dropdown-toggle"]}
							onClick={toggleDropdown}
							aria-haspopup="true"
							aria-expanded={isOpen}
						>
							<div className={classes["user-avatar"]}>
								<img
									src={userContext.user.userImage || "https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small_2x/default-avatar-photo-placeholder-profile-picture-vector.jpg"}
									alt={userContext.user.username}
								/>
							</div>
							<span>{userContext.user!.username}</span>
						</button>
						{isOpen && (
							<div className={classes["dropdown-menu"]}>
								<button
									className={classes["dropdown-item"]}
									onClick={(): void => setIsInfoPage(false)}
								>
									<span>Home</span>
								</button>
								<button
									className={classes["dropdown-item"]}
									onClick={(): void => setIsInfoPage(true)}
								>
									<span>Personal Info</span>
								</button>
								<button
									className={classes["dropdown-item"]}
									onClick={(): Promise<void> => userContext.logout()}
								>
									<span>Logout</span>
								</button>
							</div>
						)}
					</div>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;