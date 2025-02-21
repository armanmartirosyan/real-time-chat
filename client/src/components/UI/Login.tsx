import React, { ChangeEvent, useContext, useState } from "react";
import "../../@types/index.d";
import InputBox from "./InputBox/InputBox";
import classes from "./InputBox/InputBox.module.css";
import { UserContext, UserContextType } from "../../contexts/userContext";

interface LoginProps {
  isLoginPage: boolean;
  setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>; 
}

export default function Login(props: LoginProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const user: UserContextType = useContext(UserContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, handler: Function): void => {
    handler(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await user.login(email, password);
  }

  const setAccount = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    props.setIsLoginPage(!props.isLoginPage);
  }

  return (
    <section>
      <div className="signin">
        <div className="content">
          <h2>Sign In</h2>
          <form className="root-form" onSubmit={handleSubmit}>
            <InputBox
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setEmail)}
              placeholder=" "
              autoComplete="email"
              label="Email" />
            <InputBox
              type="password"
              required
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
              placeholder=" "
              autoComplete="current-password"
              label="Password" />

            <div className="links">
              <a href="#">Forgot password</a> <a onClick={setAccount}>Sign Up</a>
            </div>
            <div className={`${classes["input-box"]} form-submit-btn`}>
              <input type="submit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}