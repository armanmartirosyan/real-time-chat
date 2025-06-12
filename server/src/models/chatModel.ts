import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IChat extends Document {
	_id: Schema.Types.ObjectId;
	members: Types.ObjectId[];
	createdAt?: Date;
	updatedAt?: Date;
}

const chatSchema: Schema<IChat> = new Schema(
	{
		members: {
			type: [Schema.Types.ObjectId],
			required: true,
			ref: "User",
			validate: [(val: Types.ObjectId[]) => val.length > 1, "At least two members are required."]
		},
	},
	{ timestamps: true }
);

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;