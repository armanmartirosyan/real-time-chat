import React, { useState } from "react";
import Login from "./components/UI/Login.js";
import Signup from "./components/UI/Signup.js";
import Navabar from "./components/UI/Navbar/Navbar.js";
import "./index.css"

function App(): React.JSX.Element {


    return (
        <div>
            {/* <Navabar/> */}
            <Login/>
            {/* <Signup/> */}
        </div>
    );
}

export default App;
