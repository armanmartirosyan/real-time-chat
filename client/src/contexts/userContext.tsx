import React, { createContext, useContext, useState, ReactNode, Children } from 'react';
import AuthService from '../services/AuthService';
import { IUserDTO, AuthResponseDTO } from '../@types';
import { AxiosResponse } from "axios";

interface UserContextType {
  user: IUserDTO | null;
  setUser: React.Dispatch<React.SetStateAction<IUserDTO | null>>;
  isAuth: boolean;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  registration: (email: string, username: string, password: string, passwordConfirm: string) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<any> = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserDTO | null>(null);
	const token: string | null = localStorage.getItem("token");
  const [isAuth, setIsAuth] = useState<boolean>(!!token);

  const registration = async (email: string, username: string, password: string, passwordConfirm: string) => {
    try {
      const response: AxiosResponse<AuthResponseDTO, any> = await AuthService.registration(email, username, password, passwordConfirm);
      localStorage.setItem('token', response.data.tokenPair.accessToken);
      setIsAuth(true);
      setUser(response.data.user);
    } catch (error: any) {
      console.error(error.response?.data?.message);
    }
  };

  const value: UserContextType = {
    user,
    setUser,
    isAuth,
    setIsAuth,
    registration,
  };

  return (
    <UserContext.Provider value={value} >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
