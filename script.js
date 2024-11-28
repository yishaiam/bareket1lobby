
const rssUrl = "https://www.srugim.co.il/feed";
const newsFeed = document.getElementById("news-feed");
const weatherContainer = document.getElementById("weather");
let allNewsItems = [];

async function loadNews() {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "application/xml");
        const items = xml.querySelectorAll("item");

        items.forEach(item => {
            const title = item.querySelector("title")?.textContent || "כותרת לא זמינה";
            const link = item.querySelector("link")?.textContent || "#";
            allNewsItems.push({ title, link });
        });

        displayNewsItems();
    } catch (error) {
        console.error("Error loading RSS feed:", error);
    }
}

function displayNewsItems() {
    newsFeed.innerHTML = "";
    allNewsItems.forEach(item => {
        const newsItem = document.createElement("li");
        newsItem.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
        newsFeed.appendChild(newsItem);
    });
}

async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=31.933&longitude=34.838&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Jerusalem');
        const data = await response.json();
        weatherContainer.innerHTML = data.daily.temperature_2m_max.map((temp, index) => {
            return `<p>יום ${index + 1}: ${temp}°C</p>`;
        }).join('');
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

loadNews();
fetchWeather();
