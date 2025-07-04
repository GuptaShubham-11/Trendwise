import { model, Schema } from "mongoose";

export interface IComment {
    content: string;
    author: Schema.Types.ObjectId;
    article: Schema.Types.ObjectId;
    createdAt: Date;
}

const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    createdAt: { type: Date, default: Date.now },
});

const Comment = model("Comment", commentSchema);
export default Comment;