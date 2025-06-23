import mongoose from "mongoose";
import Chat, { IChat } from "../models/ChatModel";
import User, { IUser } from "../models/UserModel";
import APIError from "../exceptions/apiError";
import { ApiNS } from "../@types/index.d";

class ChatService {

  async createChat(chatName: string | undefined, firstId: string, secondUsername: string): Promise<ApiNS.ApiResponse> {
    const secondUser: IUser | null = await User.findOne({ username: secondUsername });
    if (!secondUser)
      throw APIError.BadRequest("Users not found");

    const secondId: mongoose.Schema.Types.ObjectId = secondUser._id;
    let chat: IChat | null = await Chat.findOne({
      members: { $all: [firstId, secondId] }
    });
    if (!chat) {
      chat = new Chat({ name: chatName, members: [firstId, secondId] });
      await chat.save();
    }
    return { success: true, data: chat };
  }

  async getAllChats(userId: string): Promise<ApiNS.ApiResponse> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw APIError.BadRequest("Invalid User ID");
    }
    const allChats: IChat[] = await Chat.find({ members: userId })
      .select("_id name members")
      .populate("members", "username userImage");
    if (!allChats) throw APIError.BadRequest("Chat not found");
    return { success: true, data: allChats };
  }

  async getChat(fId: string, sU: string): Promise<ApiNS.ApiResponse> {
    const secondUser: IUser | null = await User.findOne({ username: sU });
    if (!secondUser)
      throw APIError.BadRequest("Users not found");
    const sId: mongoose.Schema.Types.ObjectId = secondUser._id;
    const chat: IChat | null = await Chat.findOne({ members: [fId, sId] })
      .select("_id members")
      .populate("members", "username userImage");
    if (!chat)
      throw APIError.NoContent("Chat not found");
    return { success: true, data: chat };
  }

  async updateChatName(chatId: string, newName: string): Promise<ApiNS.ApiResponse> {
    const cleanName = newName.trim();
    if (!cleanName)
      throw APIError.BadRequest("Invalid Name for Chat");
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      throw APIError.BadRequest("Invalid Chat ID");
    }
    const chat: IChat | null = await Chat.findById(chatId);
    if (!chat)
      throw APIError.BadRequest("Invalid Chat ID");
    chat.name = cleanName;
    await chat.save();
    return { success: true, data: chat };
  }
}

export default ChatService;