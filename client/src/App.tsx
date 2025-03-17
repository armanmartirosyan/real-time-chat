import Login from "./components/Login";
import Signup from "./components/Signup";
import MainPage from "./components/MainPage";
import React, { useContext, useState } from "react";
import { UserContext, UserContextType } from "./contexts/userContext";
import "./index.css";

function App(): React.JSX.Element {
	const { user, isAuth, isLoading } = useContext<UserContextType>(UserContext);
	const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

	if (isLoading) {
		return <></>;
	}

	if (!isAuth) {
		return (
			<>
				{isLoginPage ? (
					<Login isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} />
				) : (
					<Signup isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} />
				)}
			</>
		);
	}

	return (
		<MainPage />
	);

}

export default App;
