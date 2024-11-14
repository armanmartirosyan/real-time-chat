import React, { useContext, useEffect } from "react";
import { UserContext, UserProvider } from "./store/userContext"; 
import Login from "./components/UI/Login";
import Signup from "./components/UI/Signup";
import Navbar from "./components/UI/Navbar/Navbar";
import "./index.css";

function App(): React.JSX.Element {
  const { user, isAuth, setAuth } = useContext(UserContext); 

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      setAuth(true);
    }
  }, [setAuth]); 

  return (
    <UserProvider>
    <div>
      {isAuth ? <Navbar username={user?.username || "Guest"} /> : <Signup />}
    </div>
    </UserProvider>
  );
}

export default App;
