import React, { useContext, useState } from "react";
import "../../@types/index.d";
import InputBox from "./InputBox/InputBox";
import classes from "./InputBox/InputBox.module.css"
import { UserContext } from "../../store/userContext";


export default function Signup(): React.JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const user = useContext(UserContext);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, handler: Function): void => {
        handler(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await user.registration(email, username, password, passwordConfirm);
    }


	return (
        <section>
            <div className="signin">
                <div className="content">
                    <h2>Sign Up</h2>
                    <form className="root-form" onSubmit={handleSubmit}>
						<InputBox
                            type="username"
                            required 
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, setUsername)}
                            placeholder=" "
                            autoComplete="username"
                            label="Username"/>
                        <InputBox
                            type="email"
                            required 
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, setEmail)}
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
						<InputBox 
                            type="password"
                            required 
                            value={passwordConfirm}
                            onChange={(e) => handleInputChange(e, setPasswordConfirm)}
                            placeholder=" " 
                            autoComplete="current-password"
                            label="Confirm Password" />
 
                        <div className={`${classes["input-box"]} form-submit-btn`}>
                            <input type="submit" value="Signup"/>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}