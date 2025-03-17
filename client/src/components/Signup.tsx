import React, { ChangeEvent, useContext, useState } from "react";
import "../@types/index.d";
import InputBox from "./InputBox/InputBox";
import classes from "./InputBox/InputBox.module.css"
import { UserContext, UserContextType} from "../contexts/userContext";

interface SignupProps {
  isLoginPage: boolean;
  setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>; 
}

export default function Signup(props: SignupProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const user: UserContextType= useContext(UserContext);

  function handleInputChange (e: React.ChangeEvent<HTMLInputElement>, handler: Function): void {
    handler(e.target.value);
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    await user.registration(email, username, password, passwordConfirm);
  }

  function setAccount (e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    props.setIsLoginPage(!props.isLoginPage);
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
              onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setUsername)}
              placeholder=" "
              autoComplete="username"
              label="Username" />
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
              onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setPassword)}
              placeholder=" "
              autoComplete="current-password"
              label="Password" />
            <InputBox
              type="password"
              required
              value={passwordConfirm}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => handleInputChange(e, setPasswordConfirm)}
              placeholder=" "
              autoComplete="current-password"
              label="Confirm Password" />

            <div className="links">
              <a href="#">Forgot password</a> <a onClick={setAccount}>Sign In</a>
            </div>
            <div className={`${classes["input-box"]} form-submit-btn`}>
              <input type="submit" value="Signup" />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}