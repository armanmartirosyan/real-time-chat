import mongoose from "mongoose";
import APIError from "../exceptions/apiError";
import { ApiNS } from "../@types/index.d";
import Message, { IMessage } from "../models/MessageModel";

class MessageService {

  async createMessage(chatId: string, userId: string, content: string): Promise<ApiNS.ApiResponse> {
    if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw APIError.BadRequest("Invalid ID");
    }
    const message: IMessage = new Message({
      chatId,
      userId,
      content,
    });
    await message.save();
    return { success: true };
  }

  async getMessages(chatId: string): Promise<ApiNS.ApiResponse> {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      throw APIError.BadRequest("Invalid ID");
    }
    const messages: IMessage[] = await Message.find({ chatId })
      .select("_id userId content createdAt")
      .populate("userId","username")
      .sort({ createdAt: -1 })
      .limit(20);
    if (!messages) throw APIError.NoContent("Messages not found");
    return { success: true, data: messages };
  }

}

export default MessageService;