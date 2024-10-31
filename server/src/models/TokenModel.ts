import mongoose, {Document, Schema} from "mongoose";

export interface ITokens extends Document {
	_id: mongoose.Schema.Types.ObjectId;
	userID: mongoose.Schema.Types.ObjectId,
	refreshToken: string,
	expiresAt: Date,
}

const tokensSchema: Schema<ITokens> = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
	expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        expires: '1d'
    },
}, { timestamps: true });


const Tokens = mongoose.model<ITokens>("Tokens", tokensSchema);

export default Tokens;