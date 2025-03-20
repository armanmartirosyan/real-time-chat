import { AxiosResponse } from "axios";
import AuthService from '../services/AuthService';
import { IUserDTO, AuthResponseDTO, IUserFormData, ApiResponse } from '../@types';
import React, { Context, useEffect, createContext, useState, ReactNode } from 'react';

export interface UserContextType {
	user: IUserDTO;
	setUser: React.Dispatch<React.SetStateAction<IUserDTO>>;
	isAuth: boolean;
	setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	registration: (email: string, username: string, password: string, passwordConfirm: string) => Promise<ApiResponse>;
	login: (email: string, password: string) => Promise<ApiResponse>;
	updateUser(user: IUserFormData): Promise<ApiResponse>;
	logout: () => Promise<void>;
	checkAuth(): Promise<void>;
}

export const UserContext: Context<UserContextType> = createContext<UserContextType>({} as UserContextType);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: ReactNode }): ReactNode=> {
	const [user, setUser] = useState<IUserDTO>({} as IUserDTO);
	const [isAuth, setIsAuth] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function registration(email: string, username: string, password: string, passwordConfirm: string): Promise<ApiResponse> {
		try {
			const response: AxiosResponse<AuthResponseDTO, any> = await AuthService.registration(email, username, password, passwordConfirm);
			localStorage.setItem("token", response.data.tokenPair.accessToken);
			setIsAuth(true);
			setUser(response.data.user);
			return { success: true };
		} catch (error: any) {
			console.error(error.response?.data?.message);
			return error.response.data;
		}
	};

	async function login(email: string, password: string): Promise<ApiResponse> {
		try {
			const response: AxiosResponse<AuthResponseDTO, any> = await AuthService.login(email, password);
			localStorage.setItem("token", response.data.tokenPair.accessToken);
			setIsAuth(true);
			setUser(response.data.user);
			return { success: true };
		} catch (error: any) {
			console.error(error.response?.data?.message);
			return error.response.data;
		}
	}

	async function updateUser(user: IUserFormData): Promise<ApiResponse> {
		try {
			const response: AxiosResponse<ApiResponse, any> = await AuthService.updateUser(user);
			return response.data;
		} catch (error: any) {
			console.error(error.response?.data?.message);
			return error.response.data;
		}
	}

	async function logout(): Promise<void> {
		try {
			await AuthService.logout();
			localStorage.removeItem("token");
			setIsAuth(false);
			setUser({} as IUserDTO);
		} catch (error: any) {
			console.error(error.response?.data?.message);
			return ;
		}
	}

	async function checkAuth(): Promise<void> {
		try {
			setIsLoading(true);
			const response: AxiosResponse<AuthResponseDTO, any> = await AuthService.refresh();
			localStorage.setItem("token", response.data.tokenPair.accessToken);
			setIsAuth(true);
			setUser(response.data.user);
		} catch (error: any) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect((): void => {
		const token: string | null = localStorage.getItem("token");
		if (token) {
			checkAuth();
		}
	}, []);

	const value: UserContextType = {
		user,
		setUser,
		isAuth,
		setIsAuth,
		isLoading,
		setIsLoading,
		registration,
		login,
		updateUser,
		logout,
		checkAuth,
	};

	return (
		<UserContext.Provider value={value} >
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
