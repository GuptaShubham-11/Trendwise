import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Comment from "../models/comment.model";

const createComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const { articleId, authorId } = req.params;
    if (!comment || !comment.trim()) {
        throw new ApiError(400, "Comment is required");
    }

    if (!articleId) {
        throw new ApiError(400, "Article ID is required");
    }

    if (!authorId) {
        throw new ApiError(400, "Author ID is required");
    }

    const newComment = await Comment.create({
        content: comment,
        author: authorId,
        article: articleId,
    });

    if (!newComment) {
        throw new ApiError(500, "Failed to create comment");
    }

    res.status(200).json(new ApiResponse(200, "Commented successfully", newComment));
});

const getCommentsOfArticle = asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    if (!articleId) {
        throw new ApiError(400, "Article ID is required");
    }

    const comments = await Comment
        .find({ article: articleId })
        .populate("author", "name");

    if (!comments) {
        throw new ApiError(500, "Failed to fetch comments");
    }
    res.status(200).json(new ApiResponse(200, "Comments fetched successfully", comments));
});

export const commentController = {
    createComment,
    getCommentsOfArticle
};