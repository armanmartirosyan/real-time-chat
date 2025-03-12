import "../../@types/index.d";
import Navbar from "./Navbar/Navbar";
import React, { useContext } from "react";
import { UserContext, UserContextType } from "../../contexts/userContext";

export default function MainPage(): React.JSX.Element {
	const { user, isAuth, isLoading } = useContext<UserContextType>(UserContext);

	return (
		<Navbar/>
	);
}