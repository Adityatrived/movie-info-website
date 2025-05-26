// script.js

const IMG_URL = "https://image.tmdb.org/t/p/w500";


const API_URL = "/api/discover"; 
const searchURL = "/api/search"; 

// Genre list 
const genres = [
  { id: 28, name: "Action" },
   { id: 12, name: "Adventure" }, 
   { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" }, 
  { id: 80, name: "Crime" },
   { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, 
  { id: 10751, name: "Family" }, 
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" }, 
  { id: 27, name: "Horror" }, 
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
   { id: 10749, name: "Romance" }, 
   { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" }, 
  { id: 53, name: "Thriller" }, 
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

let selectedGenre = [];
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagEl = document.getElementById("tags");

// Initialize genre tags
setGenre();

function setGenre() {
  tagEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      // Toggle genre selection
      if (selectedGenre.includes(genre.id)) {
        selectedGenre = selectedGenre.filter(id => id !== genre.id);
      } else {
        selectedGenre.push(genre.id);
      }
      getMovies(API_URL + buildGenreQuery());
      highlightSelection();
    });
    tagEl.append(t);
  });
}

function buildGenreQuery() {
  // Returns a query string for selected genres, 
  return selectedGenre.length ? `?with_genres=${encodeURIComponent(selectedGenre.join(","))}` : "";
}

function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => tag.classList.remove("highlight"));
  selectedGenre.forEach((id) => {
    const highlightedTag = document.getElementById(id);
    if (highlightedTag) highlightedTag.classList.add("highlight");
  });
}

// Fetch and display popular movies on load
getMovies(API_URL);

function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results && data.results.length !== 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = `<h1 class="no-results">No results Found</h1>`;
      }
    })
    .catch(() => {
      main.innerHTML = `<h1 class="no-results">Error fetching data</h1>`;
    });
}

function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <img src="${IMG_URL + poster_path}" alt="${title}" />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
    `;
    main.appendChild(movieEl);
  });
}

function getColor(vote) {
  if (vote >= 8) return "green";
  if (vote > 5) return "orange";
  return "red";
}

// Handle search form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (searchTerm) {
    // Search endpoint expects ?q=searchTerm
    getMovies(`${searchURL}?q=${encodeURIComponent(searchTerm)}`);
  } else {
    getMovies(API_URL);
  }
});
