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
