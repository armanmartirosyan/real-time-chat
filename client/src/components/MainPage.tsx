import "../@types/index.d";
import Navbar from "./Navbar/Navbar";
import React, { useState, useContext } from "react";
import { UserContext, UserContextType } from "../contexts/userContext";

export default function MainPage(): React.JSX.Element {
	const { user, isLoading } = useContext<UserContextType>(UserContext);
	const [isInfoPage, setIsInfoPage] = useState<boolean>(false);


	if (isLoading) {
		return <></>;
	}

	return (
		<>
			<Navbar setIsInfoPage={setIsInfoPage} />
			{isInfoPage ?
				(<h1 className="content">Info Page</h1>) :
				(<h1 className="content">Not Info Page</h1>)}
		</>

	);
}