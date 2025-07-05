import cron from 'node-cron';
import { scrapeGoogleTrends } from '../utils/scrapeTrends';
import { generateArticleFromTopic } from '../utils/generateArticle';
import Article from '../models/article.model';

cron.schedule('0 */6 * * *', async () => {
    try {
        console.log("⏰ Running auto article generator job...");

        const trends = await scrapeGoogleTrends();

        if (!trends || trends.length === 0) return console.warn("No trends found.");

        for (const topic of trends) {
            const slug = topic.toLowerCase().replace(/\s+/g, '-');

            const exists = await Article.findOne({ slug });
            if (exists) continue;

            const generated = await generateArticleFromTopic(topic);
            if (!generated) continue;

            await Article.create(generated);
        }

        console.log("✅ Articles generated successfully.");
    } catch (error) {
        console.error("❌ Error generating articles:", error);
    }
});
