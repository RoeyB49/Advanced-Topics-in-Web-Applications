import mongoose from "mongoose";
//postSchema - defines the pattern of the collection

export interface iPost {
  title: String;
  content: String;
  sender: String;
}
const postSchema = new mongoose.Schema<iPost>({
  title: { type: String, required: true }, //required=true - means that this paramter must have a value
  content: String,
  sender: { type: String, required: true },
});

const postModel = mongoose.model<iPost>("Posts", postSchema); //were returning an object of type of postModel which uses the interface of "iPost"

export default postModel;
// const postSchema = new Schema({
//   title: { type: String, required: true }, //required=true - means that this paramter must have a value
//   content: String,
//   sender: { type: String, required: true },
// });
