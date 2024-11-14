import "../vite-env.d";
import axios from "axios";
import { AuthResponseDTO } from "../@types/index.d";

export const API_URL = import.meta.env.VITE_API_URL;

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
	config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
	return config;
});

$api.interceptors.response.use((config) => {
	return config;
}, async (error) => {
	const originalRequest = error.config;
	if (error.response.status == 401 && error.config && !error.config._isRetry) {
		originalRequest._isRetry = true;
		try {
			const response = await axios.get<AuthResponseDTO>(`${API_URL}/api/user/refresh`, {withCredentials: true})
			localStorage.setItem('token', response.data.tokenPair.accessToken);
			return $api.request(originalRequest);
		} catch (e) {
			console.log('Not authorized.')
		}
	}
	throw error;
});

export default $api;