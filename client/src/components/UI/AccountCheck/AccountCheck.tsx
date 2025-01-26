import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts/userContext";

export default function AccountCheck(): React.JSX.Element {
  const user = useContext(UserContext);

  const handle = (e: React.ChangeEvent<HTMLInputElement>): void => {
  }
  return (
    <div><p>Already have an account?</p><a >Click Here</a></div>
  );
}