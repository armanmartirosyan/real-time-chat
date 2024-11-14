import $api from "../http/index";
import { AxiosResponse } from "axios";
import { AuthResponseDTO } from "../@types/index.d";

export default class AuthService {
	static async registration(email: string, username: string, password: string, passwordConfirm: string): Promise<AxiosResponse<AuthResponseDTO>> {
		return $api.post<AuthResponseDTO>("/api/user/registration", {email, username, password, passwordConfirm});
	}
}