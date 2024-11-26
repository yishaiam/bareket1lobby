// הגדרות כלליות
const folderID = "1MvC29P3waas6UOLOOOaPmHiHz8SL_Xky"; // ID של תיקיית התמונות ב-Google Drive
const driveApiKey = "AIzaSyDJA-7jzqRSqAuBb1Ayz9SsYcKtDkMDUwc"; // מפתח ה-API של Google Drive
const rssUrl = "https://www.srugim.co.il/feed"; // כתובת ה-RSS של אתר סרוגים
const mainImage = document.getElementById("main-image");
const newsFeed = document.getElementById("news-feed");
let imageLinks = [];
let currentImageIndex = 0;
let audioPlayer;

// פונקציה לטעינת תמונות מ-Google Drive
async function fetchImagesFromDrive() {
    console.log("Start fetching images from Drive...");
    const folderAPI = `https://www.googleapis.com/drive/v3/files?q='${folderID}'+in+parents&key=${driveApiKey}&fields=files(id,name,mimeType)`;

    try {
        const response = await fetch(folderAPI);
        console.log("Drive API Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data from Drive:", data);

        if (data.files) {
            imageLinks = data.files
                .filter(file => file.mimeType.includes("image"))
                .map(file => `https://drive.google.com/uc?id=${file.id}`);

            console.log("Image links:", imageLinks);

            if (imageLinks.length > 0) {
                mainImage.src = imageLinks[0]; // הצגת התמונה הראשונה
            } else {
                console.error("No images found in the folder.");
            }
        } else {
            console.error("Failed to retrieve files from Google Drive.");
        }
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}

// החלפת תמונות כל 5 שניות
function changeImage() {
    if (imageLinks.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % imageLinks.length;
        console.log("Switching to image index:", currentImageIndex);
        mainImage.src = imageLinks[currentImageIndex];
    } else {
        console.warn("No images available to switch.");
    }
}

setInterval(changeImage, 5000); // שינוי תמונה כל 5 שניות

// פונקציה לטעינת מבזקים מ-RSS
let allNewsItems = []; // מערך לשמירת כל המבזקים
let currentIndex = 0;

async function loadNews() {
    console.log("Start loading RSS feed...");
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        console.log("RSS API Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`Failed to fetch RSS. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched RSS data:", data);

        // פענוח Base64 (אם נדרש)
        const decodedContents = decodeURIComponent(escape(atob(data.contents.split("base64,")[1])));
        console.log("Decoded RSS contents:", decodedContents);

        // ניתוח ה-XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(decodedContents, "application/xml");
        const items = xml.querySelectorAll("item");

        if (!items || items.length === 0) {
            console.warn("No RSS items found.");
            newsFeed.innerHTML = "<li>לא נמצאו מבזקים כרגע.</li>";
            return;
        }

        // שמירת המבזקים החדשים במערך
        items.forEach((item) => {
            const title = item.querySelector("title")?.textContent || "כותרת לא זמינה";
            const link = item.querySelector("link")?.textContent || "#";
            const pubDate = item.querySelector("pubDate")?.textContent || "תאריך לא זמין";

            allNewsItems.push({ title, link, pubDate });
        });

        // שמירת 15 המבזקים האחרונים בלבד
        allNewsItems = allNewsItems.slice(-15);

        // הצגת 5 המבזקים האחרונים
        displayNewsItems();
    } catch (error) {
        console.error("Error loading RSS feed:", error);
        newsFeed.innerHTML = "<li>לא ניתן לטעון מבזקים כרגע.</li>";
    }
}

function displayNewsItems() {
    newsFeed.innerHTML = "";
    const itemsToShow = allNewsItems.slice(currentIndex, currentIndex + 5);

    itemsToShow.forEach((item) => {
        const newsItem = document.createElement("li");
        newsItem.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a> <span>${item.pubDate}</span>`;
        newsFeed.appendChild(newsItem);
    });

    console.log("Successfully displayed RSS items.");
}

function rotateNewsItems() {
    currentIndex = (currentIndex + 5) % allNewsItems.length;
    displayNewsItems();
}

// עדכון המבזקים כל דקה
setInterval(loadNews, 60000);

// תחלופה בין קבוצות של 5 מבזקים כל דקה
setInterval(rotateNewsItems, 60000);

// קריאה ראשונית לטעינת המבזקים
loadNews();



// השמעת מוזיקה ברקע בלבד
function playMusic() {
    if (!audioPlayer) {
        console.log("Starting background music...");
        audioPlayer = new Audio("https://www.youtube.com/watch?v=gdoOanw91OM");
        audioPlayer.loop = true; // חזרה בלולאה
        audioPlayer.play().catch(err => console.error("Error playing music:", err));
    } else if (audioPlayer.paused) {
        audioPlayer.play();
    }
}

function stopMusic() {
    if (audioPlayer && !audioPlayer.paused) {
        console.log("Stopping background music...");
        audioPlayer.pause();
    }
}

// קריאה ראשונית לפונקציות
fetchImagesFromDrive();
loadNews();
playMusic();

// עדכון מבזקים כל דקה
setInterval(loadNews, 60000); // עדכון כל 60 שניות
