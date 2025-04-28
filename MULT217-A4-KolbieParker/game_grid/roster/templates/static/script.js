async function fetchGames() {
    const response = await fetch('/api/games/');
    const data = await response.json();
    return data.results;
}

function filterUpcomingGames(games) {
    const today = new Date();
    return games.filter(game => {
        const gameDate = new Date(game.date);
        return gameDate >= today;
    });
}

function displayUpcomingGames(upcomingGames) {
    const container = document.getElementById('upcoming-games');
    container.innerHTML = '';

    upcomingGames.forEach(game => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
    <h3>vs ${game.opponent}</h3>
    <p>${new Date(game.date).toLocaleDateString()}</p>
    <p>${game.location}</p>
`;
        container.appendChild(card);
    });
}

function filterPastGames(games) {
    const today = new Date();
    return games.filter(game => {
        const gameDate = new Date(game.date);
        return gameDate <= today;
    });
}

function displayPastGames(pastGames) {
    const container = document.getElementById('past-games');
    container.innerHTML = '';

    pastGames.forEach(game => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
    <h3>vs ${game.opponent}</h3>
    <p>${new Date(game.date).toLocaleDateString()}</p>
    <p>${game.location}</p>
`;
        container.appendChild(card);
    });
}

function setupCarousel(containerId) {
    const container = document.getElementById(containerId);
    const prevBtn = container.parentElement.querySelector('.prev');
    const nextBtn = container.parentElement.querySelector('.next');

    if (container.children.length > 4) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';

        let scrollAmount = 0;
        const scrollStep = container.firstChild.offsetWidth + 20; // card width + gap

        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: scrollStep, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const games = await fetchGames();
    const upcomingGames = filterUpcomingGames(games);
    const pastGames = filterPastGames(games);
    displayUpcomingGames(upcomingGames);
    displayPastGames(pastGames);

    setupCarousel('upcoming-games');
    setupCarousel('past-games');
});