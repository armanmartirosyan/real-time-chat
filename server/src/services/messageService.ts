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
    return { success: true, data: message };
  }

  async getMessages(chatId: string): Promise<ApiNS.ApiResponse> {
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      throw APIError.BadRequest("Invalid ID");
    }

    const messages = await Message.find({ chatId })
      .select("_id userId content createdAt")
      .limit(20)
      .lean();

    if (!messages || messages.length === 0) {
      throw APIError.NoContent("Messages not found");
    }

    return { success: true, data: messages};
  }

}

export default MessageService;