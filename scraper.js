const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeIMDB(browser) {
    try {
        const page = await browser.newPage();
        await page.goto("https://www.imdb.com/", { waitUntil: "domcontentloaded" });

        const movies = await page.evaluate(() => {
            return Array.from(
                document.querySelectorAll(
                    "#__next > main > div > div.ipc-page-content-container.ipc-page-content-container--center.sc-b3e546b6-0.kPdXYr > section:nth-child(3) .ipc-shoveler__grid > div > a"
                )
            ).map((movie, index) => ({
                id: `IMDB${index + 1}`,
                title: movie.innerText.trim(),
            }));
        });

        fs.writeFileSync("imdb_anime.json", JSON.stringify(movies, null, 2));
        console.log("✅ IMDb Anime titles scraped successfully!");
    } catch (error) {
        console.error("Error scraping IMDb Anime:", error);
    }
}

async function scrapeRottenTomatoes(browser) {
    try {
        const page = await browser.newPage();
        await page.goto("https://www.rottentomatoes.com/search?search=anime", { waitUntil: "domcontentloaded" });

        const movies = await page.evaluate(() => {
            return Array.from(
                document.querySelectorAll("search-page-media-row a[data-qa='info-name']")
            ).map((movie, index) => ({
                id: `RT${index + 1}`,
                title: movie.innerText.trim(),
            }));
        });

        fs.writeFileSync("rottentomatoes_anime.json", JSON.stringify(movies, null, 2));
        console.log("✅ Rotten Tomatoes Anime titles scraped successfully!");
    } catch (error) {
        console.error("Error scraping Rotten Tomatoes Anime:", error);
    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    await Promise.all([scrapeIMDB(browser), scrapeRottenTomatoes(browser)]);
    await browser.close();
    console.log("✅ All scraping tasks completed!");
})();
