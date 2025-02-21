import $api from "../http/index";
import { AxiosResponse } from "axios";
import { AuthResponseDTO } from "../@types/index.d";

export default class AuthService {
	static async registration(email: string, username: string, password: string, passwordConfirm: string): Promise<AxiosResponse<AuthResponseDTO>> {
		return $api.post<AuthResponseDTO>("/api/user/registration", { email, username, password, passwordConfirm });
	}

	static async login(email: string, password: string): Promise<AxiosResponse<AuthResponseDTO>> {
		return $api.post<AuthResponseDTO>("/api/user/login", { email, password });
	}
	
	static async refresh(): Promise<AxiosResponse<AuthResponseDTO>>{
		return $api.get<AuthResponseDTO>("/api/user/refresh", {withCredentials: true});
	}
}