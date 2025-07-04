import Article from "../models/article.model";
import { scrapeGoogleTrends } from "../utils/scrapeTrends";
import { generateArticleFromTopic } from "../utils/generateArticle";

export const generateArticlesJob = async () => {
    const trends = await scrapeGoogleTrends();
    if (!trends || trends.length === 0) {
        return [];
    }

    const articles = [];

    for (const topic of trends) {
        const slug = topic.toLowerCase().replace(/\s+/g, "-");
        const exists = await Article.findOne({ slug });

        if (exists) continue;

        const generated = await generateArticleFromTopic(topic);
        if (!generated) continue;

        const article = await Article.create(generated);
        articles.push(article);
    }

    return articles;
};
