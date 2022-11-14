"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieActors = await fetchActor(movie.id);
  const movieRelated = await fetchRelated(movie.id);

  renderMovie(movieRes, movieActors, movieRelated);
};
// renderRelated(moviveRelated);

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

const fetchActor = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};

const fetchRelated = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
    
        <img src="${PROFILE_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
    <h3>${movie.title}</h3>
    <h5>Rating:</h5> <span>&#x2606; ${movie.vote_average}/10</span>
        `;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

const renderActors = (actor) => {
  let container = "";
  actor.cast.slice(0, 5).map((act) => {
    container += `
    <li>${JSON.stringify(act.name)} as ${JSON.stringify(act.character)}</li>
    `;
  });
  return container;
};

const renderRelated = (movies) => {
  let container = "";
  movies.results.slice(0, 5).map((similar) => {
    container += `<li> ${similar.original_title} </li>`;
  })
  return container;
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movieRes, movieActors, movieRelated) => {
  const actors = renderActors(movieActors);
  const similar = renderRelated(movieRelated);

  console.log(similar);
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src="${
            BACKDROP_BASE_URL + movieRes.backdrop_path
          }">
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movieRes.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movieRes.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${
              movieRes.runtime
            } Minutes</p>
            <p> <b> Movie Language: </b> ${movieRes.original_language} </p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movieRes.overview}</p>
        
        <h3>Actors:</h3>
        <ul id="actors" class="list-unstyled">
        ${actors}
        </ul>
        <h3>Related Movies:</h3>
        <ul id="actors" class="list-unstyled">
        ${similar}
        </ul>
        </div>
        </div>
    </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);