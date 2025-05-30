document.addEventListener("DOMContentLoaded", function () {
    const lastDayInput = document.getElementById("lastDayOff");
    lastDayInput.value = localStorage.getItem("lastDayOff") || "2025-05-23";
    updateCalendar();
});

function updateCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";
    
    let lastDayOff = new Date(document.getElementById("lastDayOff").value);
    localStorage.setItem("lastDayOff", lastDayOff.toISOString());

    const year = lastDayOff.getFullYear();
    let currentDate = new Date(year, 0, 1);
    let count = 0;

    for (let month = 0; month < 12; month++) {
        const monthContainer = document.createElement("div");
        monthContainer.classList.add("month");
        monthContainer.innerHTML = `<h2>${currentDate.toLocaleString("pt-BR", { month: "long" })}</h2>`;

        while (currentDate.getMonth() === month) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            dayElement.textContent = currentDate.toLocaleDateString();

            if (count % 6 === 5) {
                dayElement.classList.add("holiday");
            }

            monthContainer.appendChild(dayElement);
            currentDate.setDate(currentDate.getDate() + 1);
            count++;
        }

        calendar.appendChild(monthContainer);
    }
}
