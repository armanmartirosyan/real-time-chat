import "../@types/index.d";
import Navbar from "./Navbar/Navbar";
import Chat from "./Chat";
import UserInfo from "./UserProfile";
import { ChatProvider } from "../contexts/chatContext";
import React, { useState, useContext } from "react";
import { UserContext, UserContextType } from "../contexts/userContext";

export default function MainPage(): React.JSX.Element {
	const { user, isLoading } = useContext<UserContextType>(UserContext);
	const [isInfoPage, setIsInfoPage] = useState<boolean>(false);

	if (isLoading) {
		return <h2>Loading...</h2>;
	}

	return (
		<ChatProvider  currentUser={user}>
			<Navbar setIsInfoPage={setIsInfoPage} />
			{isInfoPage ? (<UserInfo user={user} />) : (<Chat />)}
		</ChatProvider>

	);
}