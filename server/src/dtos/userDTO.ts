import { ObjectId } from "mongoose";
import { UserNS, JwtTokens } from "../@types/index.d";

export default class UserDTO {
  _id: ObjectId;
	email: string;
	username: string;
	isValid: boolean;
	userImage?: string;

	constructor(model: UserDTO) {
    this._id = model._id;
		this.email = model.email;
		this.username = model.username;
		this.isValid = model.isValid;
		this.userImage = model.userImage;
	}
}