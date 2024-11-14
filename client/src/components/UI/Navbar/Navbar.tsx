import React from "react";
import classes from "./Navbar.module.css";

interface NavbarProps {
	username: string,
}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {

	return (
		<nav className={classes["navbar"]}>
			<ul className={classes["navbar-list"]}>
				<li className={classes["navbar-item"]}><a href="#">{props.username}</a></li>
			</ul>
		</nav>
	);
}

export default Navbar;