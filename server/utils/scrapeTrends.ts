import puppeteer from "puppeteer";

export const scrapeGoogleTrends = async (): Promise<string[]> => {
    const browser = await puppeteer.launch({
        headless: false
    });

    try {
        const page = await browser.newPage();

        if (!page) {
            throw new Error("Failed to create a new Puppeteer page");

        }

        const response = await page.goto("https://trends.google.com/trending?geo=IN");

        if (!response) {
            throw new Error("Failed to fetch Google Trends page");
        }

        const topics = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll(".mZ3RIc"));
            return elements.map(el => el.textContent?.trim() || "").filter(Boolean);
        });



        return topics.slice(0, 10); // Limit to top 10 trends
    } catch (error) {
        console.error("Puppeteer error:", error);
        return [];
    } finally {
        await browser.close();
    }
};
