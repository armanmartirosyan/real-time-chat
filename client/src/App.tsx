import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserContext, UserProvider } from "./store/userContext"; 
import Login from "./components/UI/Login";
import Signup from "./components/UI/Signup";
import Navbar from "./components/UI/Navbar/Navbar";
import "./index.css";

function MainContent(): React.JSX.Element {
  const { user, isAuth, setAuth } = useContext(UserContext);

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      setAuth(true);
    }
  }, [setAuth]);

  return (
    <Routes>
      <Route path="/" element={isAuth ? <Navigate to="/navbar" /> : <Navigate to="/signup" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

function App(): React.JSX.Element {
  return (
    <UserProvider>
      <Router>
        <MainContent />
      </Router>
    </UserProvider>
  );
}

export default App;
