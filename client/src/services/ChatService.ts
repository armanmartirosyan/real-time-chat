import $api from "../http/index";
import { AxiosResponse } from "axios";
import { ApiResponse } from "../@types/index.d";

export default class ChatService {
  static async getAllChats(userId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse, any> = await $api.get<ApiResponse>(`/api/chat/get/${userId}`);
    return response.data;
  }

  static async getChat(secondUsername: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse, any> = await $api.get<ApiResponse>(`/api/chat/get?sU=${secondUsername}`);
    return response.data;
  }

  static async getMessages(chatId: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse, any> = await $api.get<ApiResponse>(`/api/msg/get/${chatId}`);
    return response.data;
  }

  static async createMessage(chatId: string, content: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse, any> = await $api.post<ApiResponse>("/api/msg/create", { chatId, content });
    return response.data;
  }

  static async updateChatName(chatId: string, name: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse, any> = await $api.patch<ApiResponse>(`/api/chat/${chatId}/name`, { name });
    return response.data;
  }
}