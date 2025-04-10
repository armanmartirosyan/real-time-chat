import mongoose, {Document, Schema, Model} from "mongoose";

export interface IChat extends Document {
	_id: mongoose.Schema.Types.ObjectId;
	members: mongoose.Schema.Types.ObjectId[];
}

const chatSchema: Schema<IChat> = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
	members: {
		type: [mongoose.Schema.Types.ObjectId],
        required: true
	},
}, { timestamps: true });

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;