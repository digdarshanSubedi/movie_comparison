async function fetchIMDB() {
    try {
        const response = await fetch("http://localhost:9000/api/imdb");
        const data = await response.json();
        updateTable(data, "status-progress"); 
    } catch (error) {
        console.error("Error fetching IMDb data:", error);
    }
}

async function fetchRT() {
    try {
        const response = await fetch("http://localhost:9000/api/rottentomatoes");
        const data = await response.json();
        updateTable(data, "status-onhold"); 
    } catch (error) {
        console.error("Error fetching Rotten Tomatoes data:", error);
    }
}

function updateTable(movies, statusClass) {
    const tableBody = document.querySelector("#movieTable tbody");
    tableBody.innerHTML = ""; 

    movies.forEach(movie => {
        const row = `<tr>
            <td>${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.year}</td>
            <td><span class="status ${statusClass}">${statusClass === "status-progress" ? "Progress" : "On Hold"}</span></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}