import React, { useContext, useState } from "react";
import "../../@types/index.d";
import InputBox from "./InputBox/InputBox";
import classes from "./InputBox/InputBox.module.css";

export default function Login(): React.JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, handler: Function): void => {
        handler(e.target.value);
    }


	return (
        <section>
            <div className="signin">
                <div className="content">
                    <h2>Sign In</h2>
                    <form className="root-form">
                        <InputBox
                            type="email"
                            required 
                            value={email}
                            onChange={(e) => handleInputChange(e, setEmail)}
                            placeholder=" "
                            autoComplete="email"
                            label="Email"/>
                        <InputBox 
                            type="password"
                            required 
                            value={password}
                            onChange={(e) => handleInputChange(e, setPassword)}
                            placeholder=" " 
                            autoComplete="current-password"
                            label="Password" />

                        <div className="links">
                            <a href="#">Forgot password</a> <a href="/signup">Sign Up</a>
                        </div>
                        <div className={`${classes["input-box"]} form-submit-btn`}>
                            <input type="submit" value="Login"/>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}