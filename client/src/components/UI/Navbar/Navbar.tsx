import React from "react";
import classes from "./Navbar.module.css";

const Navbar: React.FC = () => {

	return (
		<nav className={classes["navbar"]}>
			<ul className={classes["navbar-list"]}>
				<li className={classes["navbar-item"]}><a href="#">PainIX</a></li>
			</ul>
		</nav>
	);
}

export default Navbar;