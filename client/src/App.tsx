import React, { useContext, useState } from "react";
import { UserContext } from "./contexts/userContext";
import Login from "./components/UI/Login";
import Signup from "./components/UI/Signup";
import Navbar from "./components/UI/Navbar/Navbar";
import "./index.css";

function App(): React.JSX.Element {
	const { user, isAuth } = useContext(UserContext);
	const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

	return (
		<>
			{!isAuth ? (
				isLoginPage ? (
					<Login isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} />
				) : (
					<Signup isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} />
				)
			) : (
				<Navbar username={user?.username || "Guest"} />
			)}
		</>
	);

}

export default App;
