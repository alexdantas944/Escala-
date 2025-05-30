document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    let lastDayOff = new Date(localStorage.getItem("lastDayOff")) || new Date("2025-05-23");
    const year = lastDayOff.getFullYear();

    let currentDate = new Date(year, 0, 1);
    let count = 0;

    while (currentDate.getFullYear() === year) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = currentDate.toLocaleDateString();

        if (count % 6 === 5) {
            dayElement.classList.add("holiday");
            lastDayOff = currentDate;
        }

        calendar.appendChild(dayElement);
        currentDate.setDate(currentDate.getDate() + 1);
        count++;
    }

    localStorage.setItem("lastDayOff", lastDayOff.toISOString());
});
