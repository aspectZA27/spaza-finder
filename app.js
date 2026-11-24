const dialog = document.getElementById("shop-dialog");
const form = document.getElementById("shop-form");
const cancelBtn = document.getElementById("cancel-btn");

// Initialize the map (Center of South Africa)
const map = L.map("map").setView([-28.5, 24.7], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Small safety helper: stops typed text from being treated as HTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(value) {
    if (!value) return "";
    const [h, m] = value.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return hour12 + ":" + String(m).padStart(2, "0") + " " + suffix;
}

function buildPopupHtml(shop) {
    let html = '<div class="shop-popup">';
    html += '<h3 class="shop-title">' + escapeHtml(shop.name) + "</h3>";

    if (shop.hours_from && shop.hours_to) {
        html +=
            '<p class="shop-hours"><strong>Hours:</strong> ' +
            formatTime(shop.hours_from) +
            " - " +
            formatTime(shop.hours_to) +
            "</p>";
    }

    if (shop.description) {
        html += '<p class="shop-description"><strong>Sells:</strong> ' + escapeHtml(shop.description) + "</p>";
    }

    html += "</div>";
    return html;
}

function addShopToMap(shop) {
    L.marker([shop.lat, shop.lng]).addTo(map).bindPopup(buildPopupHtml(shop));
}

// Hard-coded test data (same fields as the form produces)
const shops = [
    {
        name: "Test Spaza",
        description: "Airtime, bread, snacks",
        hours_from: "07:00",
        hours_to: "20:00",
        lat: -26.2041,
        lng: 28.0473,
    },
    { name: "Test Tuck Shop", lat: -25.7479, lng: 28.2293 },
];

shops.forEach(addShopToMap);

let clickedLocation = null;

// 1. Click on the map: remember where, then open the form
map.on("click", function (e) {
    clickedLocation = e.latlng;
    dialog.showModal();
});

// 2. Submit the form: read the values and add the marker
form.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    const shop = {
        name: document.getElementById("shop-name").value,
        hours_from: document.getElementById("shop-hours-from").value,
        hours_to: document.getElementById("shop-hours-to").value,
        description: document.getElementById("shop-description").value,
        lat: clickedLocation.lat,
        lng: clickedLocation.lng,
    };

    console.log(shop); // check the data looks right

    addShopToMap(shop);

    form.reset();
    dialog.close();
});

// 3. Cancel button
cancelBtn.addEventListener("click", function () {
    form.reset();
    dialog.close();
});
