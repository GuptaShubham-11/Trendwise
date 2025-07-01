import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Article, { IArticle } from "../models/article.model";
import { generateArticleFromTopic } from "../utils/generateArticle";
import { scrapeGoogleTrends } from "../utils/scrapeTrends";

const generateArticle = asyncHandler(async (req, res) => {
    const trends = await scrapeGoogleTrends(); // returns string[] of topics

    if (!trends || trends.length === 0) throw new ApiError(500, "Failed to scrape Google Trends");

    let articles: IArticle[] = [];

    for (const topic of trends) {
        const exists = await Article.findOne({ slug: topic.toLowerCase().replace(/\s+/g, "-") });
        if (exists) continue; // Skip already existing topic

        const generated = await generateArticleFromTopic(topic);
        if (!generated) continue;

        const article = await Article.create(generated);

        if (!article) throw new ApiError(500, "Failed to generate article");

        articles.push(article);
    }

    res.status(200).json(new ApiResponse(200, "Articles generated successfully", articles));
});

const getAllArticles = asyncHandler(async (req, res) => {
    const articles = await Article.find({});
    res.status(200).json(new ApiResponse(200, "Articles fetched successfully", articles));
});

export const articleController = {
    generateArticle,
    getAllArticles,
};
