import express from "express";
import { create } from "xmlbuilder2";
import Article from "../models/article.model";
import { ApiError } from "../utils/ApiError";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const baseUrl = "http://localhost:3000"; // Replace with your frontend domain
        const articles = await Article.find().select("slug updatedAt");

        const urlset = articles.map(article => ({
            url: {
                loc: `${baseUrl}/article/${article.slug}`,
                lastmod: article.updatedAt.toISOString(),
                changefreq: "weekly",
                priority: 0.8,
            },
        }));

        const xml = create({ version: "1.0" })
            .ele("urlset", { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" })
            .ele(urlset)
            .end({ prettyPrint: true });

        res.header("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        res.status(500).send("Internal Server Error");
    }
});

export default router;
