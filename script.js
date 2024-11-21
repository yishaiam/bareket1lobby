document.addEventListener("DOMContentLoaded", () => {
    const clock = document.getElementById("clock");
    const mainImage = document.getElementById("main-image");
    const mainMessage = document.getElementById("main-message");
    const announcements = document.getElementById("announcements");
    const newsFeed = document.getElementById("news-feed");

    // פונקציה לעדכון השעון
    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    }

    // עדכון התוכן מהנתונים המקומיים
    function updateContent() {
        const data = JSON.parse(localStorage.getItem("lobbyData")) || {
            image: "",
            message: "ברוכים הבאים!",
            announcements: [],
            news: []
        };

        mainImage.src = data.image || "https://via.placeholder.com/800x600";
        mainMessage.textContent = data.message;
        announcements.innerHTML = data.announcements.map(item => `<li>${item}</li>`).join('');
        newsFeed.innerHTML = data.news.map(item => `<li>${item}</li>`).join('');
    }

    // טעינת התוכן והתחלת שעון
    updateClock();
    setInterval(updateClock, 1000);
    updateContent();
});

document.addEventListener("DOMContentLoaded", () => {
    const adminForm = document.getElementById("admin-form");

    if (adminForm) {
        adminForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const image = document.getElementById("image-url").value;
            const message = document.getElementById("main-message-input").value;
            const announcements = document.getElementById("announcements-input").value.split(",");
            const news = document.getElementById("news-input").value.split(",");

            const data = {
                image,
                message,
                announcements,
                news
            };

            localStorage.setItem("lobbyData", JSON.stringify(data));
            alert("התוכן עודכן בהצלחה!");
        });
    }
});
async function loadNews() {
    const newsFeed = document.getElementById("news-feed");
    const response = await fetch("https://www.maariv.co.il/Rss/RssCategories/1"); // RSS של מעריב
    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "application/xml");

    const items = xml.querySelectorAll("item");
    newsFeed.innerHTML = "";

    items.forEach((item, index) => {
        if (index < 5) { // הצגת 5 מבזקים בלבד
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;

            const newsItem = document.createElement("li");
            newsItem.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
            newsFeed.appendChild(newsItem);
        }
    });
}

loadNews();
setInterval(loadNews, 60000); // עדכון חדשות כל דקה


