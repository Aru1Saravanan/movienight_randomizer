const API_KEY = 'c06ca1079341f0b62f0141aae3052485'; // Your TMDb API key

const movieTitles = [
    "Asako I & II (2018)",
    "Paprika (2006)",
    "The Girl with the Dragon Tattoo (2011)",
    "Whiplash (2014)",
    "Lady Vengeance (2005)",
    "Sympathy for Mr. Vengeance (2002)",
    "Perfect Blue (1997)",
    "Forrest Gump (1994)",
    "Dead Poets Society (1989)",
    "The Truman Show (1998)",
    "Past Lives (2023)",
    "Jojo Rabbit (2019)",
    "La Cienaga (2001)",
    "Bacurau (2019)",
    "Silvia Prieto (1999)",
    "The Whale (2022)",
    "Locke (2013)",
    "Beau Is Afraid (2023)",
    "The Killing of a Sacred Deer (2017)",
    "Good Time (2017)",
    "Lost in Translation (2003)",
    "(500) Days of Summer (2009)",
    "Call Me by Your Name (2017)",
    "Eternal Sunshine of the Spotless Mind (2004)",
    "Marriage Story (2019)",
    "The Hunt (2012)",
    "The Banshees of Inisherin (2022)",
    "District 9 (2009)",
    "1987: When the Day Comes (2017)",
    "Talk to Me (2022)",
    "The Blair Witch Project (1999)",
    "Megalopolis (2024)",
    "It Lives Inside (2023)",
    "The Boy in the Striped Pajamas (2008)",
    "Rose Island (2020)",
    "Ran (1985)",
    "Rashomon (1950)",
    "Gerald's Game (2017)",
    "Inheritance (2020)",
    "A tale of an onion witch (2019)",
    "The Green Mile (1999)",
    "Schindler's List (1993)",
    "Okja (2017)",
    "I Saw the Devil (2010)",
    "Assassination (2015)",
    "Silenced (2011)",
    "A Taxi Driver (2017)",
    "The Sixth Sense (1999)",
    "Eyes Wide Shut (1999)",
    "Magnolia (1999)",
    "Saving Private Ryan (1998)",
    "Good Will Hunting (1997)",
    "The Game (1997)",
    "Onibaba (1964)",
    "The Devil's Advocate (1997)",
    "Heretic (2024)",
    "When Evil Lurks (2023)",
    "Homestead (2023)",
    "The Vault way down (2021)",
    "Incendies (2010)",
    "Barbarian (2022)",
    "Red Dragon (2002)",
    "The Silence of the Lambs (1991)",
    "Eden Lake (2008)",
    "The Day of the Jackal (2024)",
    "Suicide club (2001)",
    "Nosferatu (2024)"
];

let remainingMovies = [...movieTitles]; // Tracks movies left to display

// Extract title and year from the movie string
function extractTitleAndYear(movie) {
    const match = movie.match(/^(.*)\s\((\d{4})\)$/);
    return match ? { title: match[1], year: match[2] } : { title: movie, year: null };
}

// Fetch movie details from TMDb API
async function fetchMediaDetails(title, year) {
    const query = encodeURIComponent(title);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}${
        year ? `&year=${year}` : ''
    }`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const media = data.results?.[0];
        if (media) {
            // Fetch genre details from genre IDs
            const genreNames = media.genre_ids
                ? await fetchGenres(media.genre_ids)
                : [];
            return { ...media, genres: genreNames.join(", ") };
        }
        return null;
    } catch (error) {
        console.error("Error fetching media details:", error);
        return null;
    }
}

// Fetch genre names from TMDb
async function fetchGenres(genreIds) {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const genresMap = data.genres.reduce((map, genre) => {
            map[genre.id] = genre.name;
            return map;
        }, {});
        return genreIds.map((id) => genresMap[id] || "Unknown");
    } catch (error) {
        console.error("Error fetching genres:", error);
        return [];
    }
}

// Get a random movie from the remaining list
function getRandomMovie() {
    if (remainingMovies.length === 0) {
        alert("No more movies left to show!");
        return null;
    }
    const randomIndex = Math.floor(Math.random() * remainingMovies.length);
    const movie = remainingMovies.splice(randomIndex, 1)[0]; // Remove movie from remaining list
    return movie;
}

// Display a random movie's details
async function getRandomMedia(containerId) {
    const movie = getRandomMovie();
    const container = document.getElementById(containerId);

    if (!movie) return;

    const { title, year } = extractTitleAndYear(movie);
    const media = await fetchMediaDetails(title, year);
    if (media) {
        container.innerHTML = `
            <h3>${media.title || 'Unknown Title'}</h3>
            <img src="${media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : 'fallback-image.jpg'}" alt="${media.title || 'No Title'}">
            <p>Release Date: ${media.release_date || 'Unknown'}</p>
            <p>Rating: ${media.vote_average ? `${media.vote_average}/10` : 'No rating available'}</p>
            <p>Genres: ${media.genres || 'No genres available'}</p>
            <p>${media.overview || 'No description available.'}</p>
        `;
    } else {
        container.innerHTML = `
            <p>No results found for "<strong>${title}${year ? ` (${year})` : ''}</strong>". Please try again.</p>
        `;
    }
}

// Event listener for button click
document.getElementById('getMovieBtn').addEventListener('click', async () => {
    await getRandomMedia('movieContainer');
});
