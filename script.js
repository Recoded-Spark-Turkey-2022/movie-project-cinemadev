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
  const movieActors = await fetchOtherDetails(movie.id, "credits");
  const movieRelated = await fetchOtherDetails(movie.id, "similar");
  const movieTrailer = await fetchOtherDetails(movie.id, "videos");
  // const movieRating = await fetchMovies();
  const movieRating = await fetchRatingById(movie);

  // fetchRatingById(movie);

  renderMovie(movieRes, movieActors, movieRelated, movieTrailer, movieRating);
  // renderMovie(movieRes, otherMovieDetails);
};

//Navbar - fetch Genres:
const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const result = await fetch(url);
  const genresResults = await result.json();
  genresResults.genres.forEach((genre) => {
    const genresList = document.getElementById("movie-dropdown");
    genresList.innerHTML += `<a class="dropdown-item movie-genre" id=${genre.id} href="#">${genre.name}</a>`;
  });

  const genreTypes = document.getElementsByClassName("movie-genre");
  for (const type of genreTypes) {
    type.addEventListener("click", () => {
      fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
          "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
        )}&with_genres=${type.id}`
      )
        .then((resp) => resp.json())
        .then((data) => renderMovies(data.results));
    });
  }
};
fetchGenres();

//Navbar - fetch all Actors:
const fetchActorBy = async (path) => {
  const url = constructUrl(`person/${path}`);
  const res = await fetch(url);
  const actorResults = await res.json();
  return actorResults;
};

const fetchActorsPage = async () => {
  const actorsLink = document.getElementById("popularStars");
  actorsLink.addEventListener("click", (e) => {
    e.preventDefault();
    fetchActorBy("popular").then((actorResults) => {
      renderActors(actorResults.results);
    });
  });
};
fetchActorsPage();

// const renderActor = (actorID) => {
//   const actors = document.querySelectorAll("a");
//   for (let i = 0; i < actors.length; i++) {
//     actors[i].addEventListener("click", (event) => {
//       event.preventDefault();
//       console.log("Clicked");
//       // fetchActorByID(actorID, actors[i].id);
//     });
//   }
// };

// const renderActor = () => {
//   // const actors = document.querySelectorAll("a");
//   // console.log(actors);
//   for (let i = 0; i < actors.length; i++) {
//     actors[i].addEventListener("click", (event) => {
//       event.preventDefault();
//       console.log("Clicked");
//       // fetchActorByID(actorID, actors[i].id);
//     });
//   }
// };
// renderActor();

// const fetchActor = async (actor) => {
//   const url = constructUrl(`person/${actor.id}`);
//   const result = await fetch(url);
//   const actorResults = await result.json();
//   renderMovieActors(actorResults);
// };

const fetchActorByID = async (actor) => {
  const actors = await fetchActorBy(actor.id);
  if (actor.id == actors.id) {
    console.log("tamam");
    CONTAINER.innerHTML = "";
    CONTAINER.className = "";
    CONTAINER.className = "container actorPage my-5 p-5";
    CONTAINER.innerHTML = `
      <div class="row">
      <div class="col-md-4">
      <h1>${actor.name}</h1>
      <img class="img-fluid" src="${BACKDROP_BASE_URL + actor.profile_path}" />
      <p><b>Gender:</b>${actor.gender === 2 ? "Male" : "Female"}</p>
      <p><b>Birthdate:</b>${actors.birthday}</p>
      <p><b>Deathdate:</b>${actors.deathday ? actors.deathday : "Unknown"}</p>
      <p><b>Popularity:</b>${
        actors.popularity ? actors.popularity : "Unknown"
      }</p>
      </div>
      <div class="col-md-8 mt-5">
      <h3>Biograpyh:</h3><p>${
        actors.biography ? actors.biography : "Unknown"
      }</p>
      <h3>${actor.name}'s Other Works:</h3><ul id="actor-movie-list"></ul>
      </div>
      </div>
`;
    const actorOtherWorks = document.getElementById("actor-movie-list");
    console.log(actorOtherWorks);
    actor.known_for.forEach((movies) => {
      const eachMovie = document.createElement("a");
      eachMovie.setAttribute("href", "#");
      eachMovie.innerHTML = `<li>${movies.title}</li>`;
      actorOtherWorks.appendChild(eachMovie);
      console.log(eachMovie);
      eachMovie.addEventListener("click", () => {
        movieDetails(movies);
      });
    });
  }
};

function log() {
  console.log("click");
}

// Navbar - Filter: now_playing - popular - top_rated - upcoming
const dateInput = document.getElementById("example-date-input");
const releaseDateRadio = document.getElementById("releaseDate");
const filterRadioTypes = document.querySelectorAll("input[type=radio]");
const searchFilterButton = document.getElementById("filterSearch");

dateInput.addEventListener("click", (e) => {
  releaseDateRadio.click();
});

const fetchFilter = async (path) => {
  const url = constructUrl(`movie/${path}`);
  const result = await fetch(url);
  const moviesResults = await result.json();
  return moviesResults;
};

const fetchReleaseDatesMovies = async (releaseDate) => {
  const date = releaseDate === "" ? "" : `&release_date.lte=${releaseDate}`;
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=542003918769df50083a13c415bbc602${date}`;
  const result = await fetch(url);
  const moviesResults = await result.json();
  return moviesResults;
};

searchFilterButton.addEventListener("click", (event) => {
  event.preventDefault();
  for (let i = 0; i < 3; i++) {
    if (filterRadioTypes[i].checked) {
      fetchFilter(filterRadioTypes[i].value).then((data) => {
        renderMovies(data.results);
      });
    }
  }
  if (filterRadioTypes[4].checked) {
    console.log(dateInput.value);
    fetchReleaseDatesMovies(dateInput.value).then((data) => {
      console.log(data);
      renderMovies(data.results);
    });
  }
});

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
 fetchGenresById().then((data)=>{
  console.log(data);
 });
 

  CONTAINER.innerHTML = "";
  CONTAINER.className = "";
  CONTAINER.className = "row mx-auto justify-content-center";
  // CONTAINER.style = "margin:0;";
  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.className =
      "card col-10 col-sm-4 col-md-4 col-xl-3  px-2 pt-4 m-5";
    movieDiv.style.width = "20rem";
    movieDiv.innerHTML = `
    <a class="movie-div" href="#">
       
    <h3 class="text-center text-success">${movie.title}</h3>
    <h5 class="text-center">${movie.release_date}</h5>
      <img class="card-img-top" src="${
        BACKDROP_BASE_URL + movie.backdrop_path
      }" class=" img-fluid p-2 mb-2 rounded" alt="Card image cap">
      <p class="text-center">
      <b>Genres:</b>
      </p>
      <div class="hover-content">
    <b>OVERVIEW:</b> ${movie.overview}
    </div> 
        <small class="text-muted">
        <h4 class="text-center">Rating:&#x2606;</h4>
        <h4 class="text-center"> ${movie.vote_average}/10</h4>
        </small>
      </a>
    `;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  CONTAINER.className = "";
  CONTAINER.className = "row mx-auto justify-content-center";
  actors.forEach((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.className =
      "card col-10 col-sm-4 col-md-4 col-xl-3  px-2 pt-4 m-5";
    actorDiv.style.width = "20rem";
    actorDiv.innerHTML = `
      <a class="actor-div" href="#">
     <h3 class="text-center text-success">${actor.name}</h3>
     <img class="card-img-top img-fluid p-2 mb-2" src="${
       PROFILE_BASE_URL + actor.profile_path
     }" class=" img-fluid p-2 mb-2 rounded" alt="Card image cap">
      </a>
    `;
    actorDiv.addEventListener("click", () => {
      // fetchActor(actor);
      fetchActorByID(actor);
    });
    CONTAINER.appendChild(actorDiv);
  });
};

const fetchSearch = async (query) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&query=${query}`;
  const res = await fetch(url);
  const searchRes = await res.json();
  return searchRes;
};

// const searchDetails = async (query) => {
//   const searchRes = await fetchSearch(query);
//   return searchRes;
// };

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const searchResults = () => {
  fetchSearch(searchInput.value).then((data) => {
    renderMovies(data.results);
  });
};

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchResults();
  searchInput.value = "";
});

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

const fetchOtherDetails = async (movieId, details) => {
  const url = constructUrl(`movie/${movieId}/${details}`);
  const res = await fetch(url);
  return res.json();
};

const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};

// const naji = (genresid) => {
//   // console.log(genresid);
//   genresid.forEach((genreid) => {
//     // console.log(genreid);
//     return genreid;
//   });
// };

const fetchRatingById = async (movie) => {
  const movies = await fetchMovie(movie.id);
  if (movie.id === movies.id) {
    return movie.vote_average;
  }
};

// const renderGender = (genderId) => {
//   for (let i = 0; i < genderId.length; i++) {
//     fetchGenreByID(genderId[i].name);
//     // console.log(genderId[i])
//   }
// };

// console.log(fetchGenreByID());

const fetchGenresDetails = async () => {
  const url = constructUrl(`genre/movie/list`);
  const result = await fetch(url);
  const genresResults = await result.json();
  return genresResults.genres;
};

const fetchGenresById = async () => {
  const genreName = document.createElement("p");
  const movies = await fetchMovies();
  const genres = await fetchGenresDetails();
  // console.log(movies.results);
  // console.log(genres);
  movies.results.map((movie) => {
    for (let i = 0; i < movie.genre_ids.length; i++) 
    for (let j=0; j< genres.length; j++) {
      if (movie.genre_ids[i] === genres[j].id) {
      // console.log(movie.genre_ids[i]);
      // console.log(genres[j].id);
      console.log(genres[j].name);
        // console.log("tamam");
        genreName.innerHTML += `<p>${genres[j].name}</p>`;
      }
    }
  });
  // console.log(container);
  return genreName;
};

// const renderMovieActors = (movieActors) => {
//   // let container = "";
//   const actorLists = document.createElement("li");
//   movieActors.cast.slice(0, 5).forEach((actor) => {
//     actorLists.innerHTML += `
//     <a id="naji" href="#">${JSON.stringify(actor.name)}</a> as ${JSON.stringify(
//       actor.character
//     )}

//       `;
//     const actors = document.getElementById("naji");
//     console.log(actors);
//   });
//   return actorLists;
// };

const renderMovieRelated = (movies) => {
  // console.log(movies);
  let container = "";
  movies.results.slice(0, 5).map((similar) => {
    const similarMovies = document.createElement("a");
    similarMovies.setAttribute("href", "#");
    container += `<li id="similar-movies"> ${similar.original_title} </li>`;
    // const relatedMovies = document.getElementById("similar-movies");
    // console.log(relatedMovies);
    // relatedMovies.addEventListener("click",()=>{
    //   console.log("click");
    // })
    // relatedMovies.appendChild(similarMovies);
    // similarMovies.addEventListener("click", () => {
    //   movieDetails(movies);
    // });
  });
  return container;
};

const renderMovieTrailer = (movies) => {
  let container = "";
  movies.results.map((trailer) => {
    container = `<iframe width="420" height="315"
    src="https://www.youtube.com/embed/${trailer.key}">
    </iframe>`;
  });
  return container;
};

const renderMovieComp = (movies) => {
  let container = "";
  movies.production_companies.map((company) => {
    container += `<h5>${
      company.name
    }</h5> <img id="movie-backdrop" class="img-fluid" src="${
      BACKDROP_BASE_URL + company.logo_path
    }">`;
  });
  return container;
};

const renderMovieDirector = (movies) => {
  let container = "";
  movies.crew.map((director) => {
    if (director.job === "Director") {
      container = `<p>${director.name}</p>`;
    }
  });
  return container;
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (
  movieRes,
  movieActors,
  movieRelated,
  movieTrailer,
  movieRating
) => {
  // const actors = renderMovieActors(movieActors);
  const similar = renderMovieRelated(movieRelated);
  const trailer = renderMovieTrailer(movieTrailer);
  const productionComp = renderMovieComp(movieRes);
  const directorName = renderMovieDirector(movieActors);

  CONTAINER.innerHTML = "";
  CONTAINER.className = "";
  CONTAINER.className = "container moviePage my-5 p-5";
  CONTAINER.innerHTML = `
  <div class="row justify-content-center">
  <h1 id="movie-title" class="mb-5 text-uppercase">${movieRes.title}</h1>
  <img id="movie-backdrop" class="img-fluid mx-auto d-block" id="media-backdrop" src="${
    BACKDROP_BASE_URL + movieRes.backdrop_path
  }">
  <div class="col-md-4">
  <p id="movie-release-date" class="mt-5"><b>Release Date:</b> ${
    movieRes.release_date
  }</p>
  <p id="movie-runtime">
  ${movieRes.runtime ? "<b>Runtime:</b> " + movieRes.runtime + " Minutes" : ""}
  </p>
  <p> <b> Movie Language: </b> ${movieRes.original_language.toUpperCase()} </p>
  <p> <b> Movie Rating: </b> ${movieRating}/10 </p>
  <h3>Related Movies:</h3>
  <ul id="similar-movies" class="list-unstyled">
  ${similar}
  </ul>
  </div>
  <div class="col-md-8">
            <h3  class="mt-5">Overview:</h3>
            <p id="movie-overview">${movieRes.overview}</p>
            <h3>Director Name:</h3>
            <ul id="dir" class="list-unstyled">
           ${directorName}
            </ul>
        <h3>Actors:</h3>
        <ul id="actors" class="list-unstyled">
       
        </ul>
        
        <div>
        <h2> Trailer: </h2>
        ${trailer}
        </div>
        <h3>Production Companies:</h3>
        <ul id="prod" class="list-unstyled">
       ${productionComp}
        </ul>
        
        </div>
</div>
    </div>`;
  // renderActor(movieActors.id);
};
// fetchGenresById();

document.addEventListener("DOMContentLoaded", autorun);
