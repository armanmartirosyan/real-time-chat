import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document {
	email: string;
	username: string;
	password: string;
	isValid: boolean;
	activationLink: string;
}

const userSchema: Schema<IUser> = new Schema ({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: {
            validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
			message: props => `${props.value} is not a vaild email.`
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
	}

}, {timestamps: true});


const User = mongoose.model<IUser>("User", userSchema);

export default User;