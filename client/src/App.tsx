import React, { useState } from "react";
import Login from "./components/UI/Login.js";
import Signup from "./components/UI/Signup.js";
import "./index.css"

function App(): React.JSX.Element {


    return (
        <div>
            <Login/>
            {/* <Signup/> */}
        </div>
    );
}

export default App;
