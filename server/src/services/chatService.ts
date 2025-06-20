import mongoose from "mongoose";
import Chat, { IChat } from "../models/ChatModel";
import User, { IUser } from "../models/UserModel";
import APIError from "../exceptions/apiError";
import { ApiNS } from "../@types/index.d";

class ChatService {

  async createChat(chatName: string | undefined, firstId: string, secondId: string): Promise<ApiNS.ApiResponse> {
    if (!mongoose.Types.ObjectId.isValid(firstId) || !mongoose.Types.ObjectId.isValid(secondId)) {
      throw APIError.BadRequest("Invalid User ID");
    }
    const users: IUser[] = await User.find({ _id: { $in: [firstId, secondId] } });
    if (users.length !== 2)
      throw APIError.BadRequest("Users not found");
    let chat: IChat | null = await Chat.findOne({
      members: { $all: [firstId, secondId] }
    });
    if (!chat) {
      chat = new Chat({ name: chatName, members: [firstId, secondId] });
      await chat.save();
    }
    return { success: true };
  }

  async getAllChats(userId: string): Promise<ApiNS.ApiResponse> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw APIError.BadRequest("Invalid User ID");
    }
    const allChats: IChat[] = await Chat.find({ members: userId })
      .select("_id members")
      .populate("members", "username userImage");
    if (!allChats) throw APIError.BadRequest("Chat not found");
    return { success: true, data: allChats };
  }

  async getChat(fId: string, sId: string): Promise<ApiNS.ApiResponse> {
    if (!mongoose.Types.ObjectId.isValid(fId) || !mongoose.Types.ObjectId.isValid(sId)) {
      throw APIError.BadRequest("Invalid User ID");
    }
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
    return { success: true };
  }
}

export default ChatService;