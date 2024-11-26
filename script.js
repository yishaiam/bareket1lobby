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

        // ניקוי הרשימה הקיימת והוספת מבזקים חדשים
        newsFeed.innerHTML = "";
        items.forEach((item, index) => {
            if (index < 5) { // הצגת 5 מבזקים בלבד
                const title = item.querySelector("title")?.textContent || "כותרת לא זמינה";
                const link = item.querySelector("link")?.textContent || "#";

                const newsItem = document.createElement("li");
                newsItem.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                newsFeed.appendChild(newsItem);
            }
        });

        console.log("Successfully loaded RSS items.");
    } catch (error) {
        console.error("Error loading RSS feed:", error);
        newsFeed.innerHTML = "<li>לא ניתן לטעון מבזקים כרגע.</li>";
    }
}



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
