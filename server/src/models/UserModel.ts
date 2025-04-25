import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
	_id: mongoose.Schema.Types.ObjectId;
	email: string;
	username: string;
	password: string;
	isValid: boolean;
	activationLink: string;
	userImage?: string;
}

const userSchema: Schema<IUser> = new Schema ({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: {
            validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
			message: props => `${props.value} is not a valid email.`
		}
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 4,
		maxlength: 30,
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	isValid: {
		type: Boolean,
		default: false,
	},
	activationLink: {
		type: String,
		required: true,
	},
	userImage: {
		type: String,
		required: false,
	}

}, {timestamps: true});


const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;