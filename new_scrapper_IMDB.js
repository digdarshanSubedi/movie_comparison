const puppeteer = require("puppeteer");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeIMDB() {
    try {
        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        const userAgent = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
        ];
        await page.setUserAgent(userAgent[Math.floor(Math.random() * userAgent.length)]);
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto("https://www.imdb.com/chart/top/", { waitUntil: "domcontentloaded" });

        await sleep(Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000);

        const movies = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".sc-d5ea4b9d-0.ejavrk.cli-children")).map((movie, index) => ({
                id: `IMDB${index + 1}`,
                title: movie.querySelector(".ipc-title__text")?.innerText.trim(),
                year: movie.querySelector(".sc-d5ea4b9d-7.URyjV.cli-title-metadata-item")?.innerText.trim(),
            }));
        });

        fs.writeFileSync("imdb_top_movies.json", JSON.stringify(movies, null, 2));

        const csvWriter = createCsvWriter({
            path: 'imdb_top_movies.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'title', title: 'Title' },
                { id: 'year', title: 'Year' }
            ]
        });
        await csvWriter.writeRecords(movies);

        console.log("✅ IMDb Top movies scraped and saved successfully!");

        await browser.close();
    } catch (error) {
        console.error("❌ Error scraping IMDb Top movies:", error);
    }
}

scrapeIMDB();