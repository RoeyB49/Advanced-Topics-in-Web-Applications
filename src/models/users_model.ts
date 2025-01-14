import mongoose from "mongoose";
//postSchema - defines the pattern of the collection

export interface IUser {
  email: String;
  password: String;
  _id?: string; //unique id for each user
  refreshTokens: string[]; // an array of tokens so the user could get a different token for each device
}
const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true }, //required=true - means that this paramter must have a value
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] }, //an array of tokens so the user could get a different token for each device
});

const userModel = mongoose.model<IUser>("Users", userSchema); //were returning an object of type of postModel which uses the interface of "iPost"

export default userModel;
// const postSchema = new Schema({
//   title: { type: String, required: true }, //required=true - means that this paramter must have a value
//   content: String,
//   sender: { type: String, required: true },
// });
