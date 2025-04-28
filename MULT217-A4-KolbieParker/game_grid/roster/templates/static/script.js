async function fetchGames() {
    let allGames = [];
    let url = '/api/games/';

    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        allGames = allGames.concat(data.results);
        url = data.next;
    }

    return allGames;
}

function filterUpcomingGames(games) {
    const today = new Date();
    return games
        .filter(game => {
            const gameDate = new Date(game.date);
            return gameDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function displayUpcomingGames(upcomingGames) {
    const container = document.getElementById('upcoming-games');
    const locationMap = { 'H': 'Home', 'A': 'Away' };
    container.innerHTML = '';

    upcomingGames.forEach(game => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
    <h3>vs ${game.opponent}</h3>
    <p>${new Date(game.date).toLocaleDateString()}</p>
    <p>${locationMap[game.location] || 'Unknown'}</p>
`;
        container.appendChild(card);
    });
}

function filterPastGames(games) {
    const today = new Date();
    return games
        .filter(game => {
            const gameDate = new Date(game.date);
            return gameDate <= today;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function displayPastGames(pastGames) {
    const container = document.getElementById('past-games');
    const locationMap = { 'H': 'Home', 'A': 'Away' };
    container.innerHTML = '';

    pastGames.forEach(game => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
    <h3>vs ${game.opponent}</h3>
    <p>${new Date(game.date).toLocaleDateString()}</p>
    <p>${locationMap[game.location] || 'Unknown'}</p>
`;
        container.appendChild(card);
    });
}


function setupCarousel(trackId, prevBtnClass, nextBtnClass) {
    const track = document.getElementById(trackId);
    const prevBtn = document.querySelector('.' + prevBtnClass);
    const nextBtn = document.querySelector('.' + nextBtnClass);

    let currentSlide = 0;
    const card = track.querySelector('.card');
    const slideWidth = card ? card.offsetWidth + 32 : 300; 
    const totalCards = track.querySelectorAll('.card').length;
    const viewport = track.parentElement;
    const cardsPerView = Math.floor(viewport.offsetWidth / (card.offsetWidth + 32));

    const maxSlide = totalCards - cardsPerView;

    prevBtn.addEventListener('click', () => {
        currentSlide = Math.max(currentSlide - 1, 0);
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = Math.min(currentSlide + 1, maxSlide);
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    const games = await fetchGames();
    const upcomingGames = filterUpcomingGames(games);
    const pastGames = filterPastGames(games);

    displayUpcomingGames(upcomingGames);
    displayPastGames(pastGames);

    setupCarousel('upcoming-games', 'prev-upcoming', 'next-upcoming');
    setupCarousel('past-games', 'prev-past', 'next-past');
});