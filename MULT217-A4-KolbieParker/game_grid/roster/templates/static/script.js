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

async function fetchRoster() {
    let allPlayers = [];
    let url = '/api/players/';

    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
            allPlayers = allPlayers.concat(data.results);
        } else {
            allPlayers = allPlayers.concat(data); 
            break;
        }
        url = data.next;
    }

    return allPlayers;
}

function displayRoster(players) {
    players.sort((a, b) => (a.number || 0) - (b.number || 0));
    const container = document.getElementById('roster-list');
    container.innerHTML = `
        <table class="roster-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Position</th>
                </tr>
            </thead>
            <tbody>
                ${players.map(player => `
                    <tr>
                        <td>${player.jersey_number || '-'}</td>
                        <td>${player.first_name + " " + player.last_name || '-'}</td>
                        <td>${player.position || '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function fetchPlayerGameStats() {
    let allPlayerGameStats = [];
    let url = '/api/playergamestats/';

    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
            allPlayerGameStats = allPlayerGameStats.concat(data.results);
        } else {
            allPlayerGameStats = allPlayerGameStats.concat(data); 
            break;
        }
        url = data.next;
    }

    return allPlayerGameStats;
}

function displayPlayerGameStats(playerStats) {
    const playerTotals = {};

    playerStats.forEach(stat => {
        const playerName = stat.player_name;

        if (!playerTotals[playerName]) {
            playerTotals[playerName] = {
                goals: 0,
                assists: 0,
                penalties: 0
            };
        }

        playerTotals[playerName].goals += stat.goals || 0;
        playerTotals[playerName].assists += stat.assists || 0;
        playerTotals[playerName].penalties += stat.penalties || 0;
    });

    const container = document.getElementById('teamstats-list');

    //Sort highest to lowest total points for players
    const sortedPlayers = Object.entries(playerTotals).sort((a, b) => {
        const aPoints = a[1].goals + a[1].assists;
        const bPoints = b[1].goals + b[1].assists;
        return bPoints - aPoints;
    });

    container.innerHTML = `
        <table class="teamstats-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total Points</th>
                    <th>Goals</th>
                    <th>Assists</th>
                    <th>Penalty Minutes</th>
                </tr>
            </thead>
            <tbody>
                ${sortedPlayers.map(([name, stats]) => `
                    <tr>
                        <td>${name}</td>
                        <td>${stats.goals + stats.assists}</td>
                        <td>${stats.goals}</td>
                        <td>${stats.assists}</td>
                        <td>${stats.penalties}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}


document.addEventListener('DOMContentLoaded', async () => {
    const games = await fetchGames();
    const upcomingGames = filterUpcomingGames(games);
    const pastGames = filterPastGames(games);

    displayUpcomingGames(upcomingGames);
    displayPastGames(pastGames);

    setupCarousel('upcoming-games', 'prev-upcoming', 'next-upcoming');
    setupCarousel('past-games', 'prev-past', 'next-past');

    const roster = await fetchRoster();
    displayRoster(roster);

    const playerStats = await fetchPlayerGameStats();
    displayPlayerGameStats(playerStats);
});