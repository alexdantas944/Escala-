document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const daysInMonth = new Date().getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        day.textContent = i;
        day.addEventListener('click', () => {
            day.classList.toggle('selected');
        });
        calendar.appendChild(day);
    }
});
