import React, { useState } from "react";
import "./Login.css";

export default function Login(): React.JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, handler: Function): void => {
        handler(e.target.value);
    }


	return (
        <section>
            <div className="signin">
                <div className="content">
                    <h2>Sign In</h2>
                    <form className="login-form">
                        <div className="input-box">
                            <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => handleInputChange(e, setEmail)}
                            placeholder=" "
                            autoComplete="email" />
                            <label>Email</label>
                        </div>
                        <div className="input-box">
                            <input 
                            type="password"
                            required 
                            value={password}
                            onChange={(e) => handleInputChange(e, setPassword)}
                            placeholder=" " 
                            autoComplete="current-password" />
                            <label>Password</label>
                        </div>
                        <div className="links">
                            <a href="#">Forgot password</a> <a href="#">Signup</a>
                        </div>
                        <div className="input-box form-submit-btn">
                            <input type="submit" value="Login"/>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}