const driveApiKey = "AIzaSyDJA-7jzqRSqAuBb1Ayz9SsYcKtDkMDUwc";
const folderID = "1MvC29P3waas6UOLOOOaPmHiHz8SL_Xky";
const mainImage = document.getElementById("main-image");
let imageLinks = [];
let currentImageIndex = 0;

// 1. טעינת תמונות מתיקיית Google Drive
async function fetchImagesFromDrive() {
    const folderAPI = `https://www.googleapis.com/drive/v3/files?q='${folderID}'+in+parents&key=${driveApiKey}&fields=files(id,name,mimeType)`;
    try {
        const response = await fetch(folderAPI);
        const data = await response.json();

        if (data.files && data.files.length > 0) {
            // סינון תמונות בלבד
            imageLinks = data.files
                .filter(file => file.mimeType.includes("image"))
                .map(file => `https://drive.google.com/uc?id=${file.id}`);

            if (imageLinks.length > 0) {
                mainImage.src = imageLinks[0]; // מציג את התמונה הראשונה
            } else {
                console.error("לא נמצאו תמונות בתיקיה.");
            }
        } else {
            console.error("התיקיה ריקה או שאין לך הרשאות.");
        }
    } catch (error) {
        console.error("שגיאה בטעינת התמונות:", error);
    }
}

// החלפת תמונות כל 5 שניות
function changeImage() {
    if (imageLinks.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % imageLinks.length;
        mainImage.src = imageLinks[currentImageIndex];
    }
}

// הפעלת פונקציות טעינת התמונות והחלפתן
fetchImagesFromDrive();
setInterval(changeImage, 5000); // שינוי תמונה כל 5 שניות

// 2. השמעת מוזיקה ברקע בלבד
let audioPlayer;

function playMusic() {
    if (!audioPlayer) {
        audioPlayer = new Audio("https://www.youtube.com/watch?v=gdoOanw91OM");
        audioPlayer.loop = true; // חזרה בלולאה
        audioPlayer.play();
    } else if (audioPlayer.paused) {
        audioPlayer.play();
    }
}

function stopMusic() {
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
    }
}

// 3. טעינת מבזקי חדשות מאתר "מעריב"
async function loadNews() {
    const newsFeed = document.getElementById("news-feed");
    const response = await fetch("https://www.maariv.co.il/Rss/RssCategories/1");
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

// הפעלת מבזקי חדשות
loadNews();
setInterval(loadNews, 60000); // עדכון חדשות כל דקה
