import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMessage extends Document {
	_id: Schema.Types.ObjectId;
	chatId: Schema.Types.ObjectId;
	userId: Schema.Types.ObjectId;
	content: string;
}

const messageSchema: Schema<IMessage> = new Schema({
	chatId: {
		type: Schema.Types.ObjectId,
		ref: "Chat",
		required: true,
		index: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		index: true,
	},
	content: {
		type: String,
		required: true,
		maxlength: 500,
		trim: true,
		validate: {
			validator: (v: string) => v.trim().length > 0,
			message: "Message content cannot be empty.",
		},
	}
}, { timestamps: true });

const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;