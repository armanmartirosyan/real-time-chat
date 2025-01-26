import React, { useContext, useEffect, useState } from "react";
import { UserContext, UserProvider } from "./contexts/userContext";
import Login from "./components/UI/Login";
import Signup from "./components/UI/Signup";
import Navbar from "./components/UI/Navbar/Navbar";
import "./index.css";

function App(): React.JSX.Element {
  const { user, isAuth, setAuth } = useContext(UserContext);
  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      setAuth(true);
    }
  }, [setAuth]);


  return (
    <UserProvider>
      {/* {!isAuth ? (
      isLoginPage ? (
        <Login isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} />
      ) : (
        <Signup isLoginPage={isLoginPage} setIsLoginPage={setIsLoginPage} />
      )
    ) : (
      <Navbar username={user?.username || "Guest"}/>
    )} */}
      <Navbar username="asdf" />
    </UserProvider>
  );

}

export default App;
