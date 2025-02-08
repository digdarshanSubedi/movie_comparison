const puppeteer = require("puppeteer");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeRottenTomatoes() {
    try {
        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        const userAgent = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
        ];
        await page.setUserAgent(userAgent[Math.floor(Math.random() * userAgent.length)]);
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto("https://editorial.rottentomatoes.com/guide/best-movies-of-all-time/", { waitUntil: "domcontentloaded" });

        await sleep(Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000);

        const movies = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("td p.movie")).map((movie, index) => ({
                id: `RT${index + 1}`,
                title: movie.querySelector("a.title")?.innerText.trim(),
                year: movie.querySelector(".year")?.innerText.replace(/[()]/g, "").trim(), // Remove parentheses around the year
            }));
        });

        fs.writeFileSync("rottentomatoes_movies.json", JSON.stringify(movies, null, 2));

        const csvWriter = createCsvWriter({
            path: 'rottentomatoes_movies.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'title', title: 'Title' },
                { id: 'year', title: 'Year' }
            ]
        });
        await csvWriter.writeRecords(movies);

        console.log("✅ Rotten Tomatoes movies scraped and saved successfully!");

        await browser.close();
    } catch (error) {
        console.error("❌ Error scraping Rotten Tomatoes movies:", error);
    }
}

scrapeRottenTomatoes();