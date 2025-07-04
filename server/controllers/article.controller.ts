import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Article, { IArticle } from "../models/article.model";
import { generateArticleFromTopic } from "../utils/generateArticle";
import { scrapeGoogleTrends } from "../utils/scrapeTrends";
import { Request, Response } from "express";

const generateArticle = asyncHandler(async (_req: Request, res: Response) => {
    const trends = await scrapeGoogleTrends(); // returns string[]

    if (!trends?.length) {
        throw new ApiError(500, "Failed to scrape Google Trends");
    }

    const articles: IArticle[] = [];

    for (const topic of trends) {
        const slug = topic.toLowerCase().replace(/\s+/g, "-");

        const exists = await Article.findOne({ slug }).lean();
        if (exists) continue;

        const generated = await generateArticleFromTopic(topic);
        if (!generated) continue;

        const article = await Article.create(generated);
        if (!article) throw new ApiError(500, "Failed to generate article");

        articles.push(article);
    }

    res.status(200).json(new ApiResponse(200, "Articles generated successfully", articles));
});

const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;

    if (page < 1 || limit < 1) {
        throw new ApiError(400, "Page and limit must be positive integers");
    }

    const skip = (page - 1) * limit;

    const [articles, totalCount] = await Promise.all([
        Article.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Article.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json(
        new ApiResponse(200, "Articles fetched successfully", {
            articles,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
            },
        })
    );
});

const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    if (!slug) throw new ApiError(400, "Slug is required");

    const article = await Article.findOne({ slug }).lean();

    if (!article) throw new ApiError(404, "Article not found");

    res.status(200).json(new ApiResponse(200, "Article fetched successfully", article));
});

export const articleController = {
    generateArticle,
    getAllArticles,
    getArticleBySlug,
};
