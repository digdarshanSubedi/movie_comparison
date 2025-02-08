const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

//  IMDb Routes
app.get("/api/imdb", (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync("imdb_top_movies.json", "utf8"));
        res.json(data);
    } catch (error) {
        console.error("Error reading IMDb data:", error);
        res.status(500).json({ error: "Failed to load IMDb data" });
    }
});

// Rotten Tomatoes Routes
app.get("/api/rottentomatoes", (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync("rottentomatoes_movies.json", "utf8"));
        res.json(data);
    } catch (error) {
        console.error("Error reading Rotten Tomatoes data:", error);
        res.status(500).json({ error: "Failed to load Rotten Tomatoes data" });
    }
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});