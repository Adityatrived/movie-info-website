const api_key = "api_key=958a1b30e3daebc200cb51a03e6267a2";
const base_url = "https://api.themoviedb.org/3";
const API_URL = base_url + "/discover/movie?sort_by=popularity.desc&" + api_key;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = base_url + "/search/movie?" + api_key;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

var selectedGenre = [];
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagEl = document.getElementById("tags");

setgenre();
function setgenre() {
  tagEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getmovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(",")));
      highlightselection();
    });
    tagEl.append(t);
  });
}

function highlightselection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });
  if (selectedGenre != 0) {
    selectedGenre.forEach((id) => {
      const highlightedtag = document.getElementById(id);
      highlightedtag.classList.add("highlight");
    });
  }
}

getmovies(API_URL);

function getmovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length != 0) {
        showmovies(data.results);
      } else {
        main.innerHTML = `<h1 class="no-results">No results Found</h1>`;
      }
    });
}

function showmovies(data) {
  main.innerHTML = ``;

  data.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = ` <img src="${IMG_URL + poster_path} " alt="${title}" />
      <div class="movie-info">
        <h3>${title}</h3>
        <span class=${getColor(vote_average)}>${vote_average}</span>
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
  if (vote >= 8) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    getmovies(searchURL + "&query=" + searchTerm);
  } else {
    getmovies(API_URL);
  }
});