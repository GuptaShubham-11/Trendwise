import { Schema, model } from "mongoose";

export interface IArticle {
    title: string;
    slug: string;
    content: string;
    metaDescription: string;
    headings: string[];
}

const articleSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        metaDescription: { type: String, required: true },
        headings: [String],
    },
    { timestamps: true }
);

const Article = model("Article", articleSchema);
export default Article;
