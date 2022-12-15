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
  const movieTrailer = await fetchTrailer(movie.id);

  renderMovie(movieRes, movieActors, movieRelated, movieTrailer);
};

//Navbar - fetch Genres:
const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const result = await fetch(url);
  const genresResults = await result.json();
  // console.log(genresResults);
  genresResults.genres.forEach((genre) => {
    const genresList = document.createElement("li");
    genresList.innerHTML = `<a id="genre-btn" href="#">${genre.name}</a>`;
    document.getElementById("dropgeneres").appendChild(genresList);
    genresList.addEventListener("click", () => {
      console.log("clicked");
      fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${atob(
          "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
        )}&with_genres=${genre.id}`
      )
        .then((resp) => resp.json())
        .then((data) => renderMovies(data.results));
    });
  });
};
fetchGenres();

//Navbar - fetch all Actors:
const fetchActors = async () => {
  const url = constructUrl("person/popular");
  const result = await fetch(url);
  const actorsResults = await result.json();
  // console.log(actorsResults);
  renderActors(actorsResults.results);
};

const fetchActor = async (actor) => {
  const url = constructUrl(`person/${actor.id}`);
  const result = await fetch(url);
  const actorResults = await result.json();
  renderActor(actorResults);
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  CONTAINER.innerHTML = "";
  const moviesContainer = document.createElement("div");
  moviesContainer.classList.add("row");
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("col-4");
    movieDiv.setAttribute("style", "margin-top:20px;");
    movieDiv.innerHTML = `
    <a class="movie-div" href="#">
    <div class="card">
    <div class="hover-content">
    ${movie.overview}
    </div>    
      <img class="card-img-top" src="${
        PROFILE_BASE_URL + movie.backdrop_path
      }" alt="Card image cap">
      <h2 class="card-title">${movie.title}</h2>
      <div class="card-body">
      <p>
      Genres:
      ${naji(movie.genre_ids)}
      </p>
      </div>
      <div class="card-footer">
        <small class="text-muted">
        <h4>Rating:&#x2606; ${movie.vote_average}/10</h4>
        </small>
      </div>
      </div>
      </a>
    `;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    moviesContainer.appendChild(movieDiv);
    CONTAINER.appendChild(moviesContainer);
  });
};

const renderActors = (actors) => {
  CONTAINER.innerHTML = "";
  const actorsContainer = document.createElement("div");
  actorsContainer.classList.add("row");
  actors.map((actor) => {
    // console.log(actor);
    const actorDiv = document.createElement("div");
    actorDiv.classList.add("col-4");
    actorDiv.setAttribute("style", "margin-top:20px;");
    actorDiv.innerHTML = `
    <a class="movie-div" href="#">
    <div class="card">  
      <img class="card-img-top" src="${
        PROFILE_BASE_URL + actor.profile_path
      }" alt="Card image cap">
      <h2 class="card-title">${actor.name}</h2>
      <div class="card-body">
      </div>
      <div class="card-footer">

      </div>
      </div>
      </a>
    `;
    actorsContainer.appendChild(actorDiv);
    CONTAINER.appendChild(actorsContainer);
    actorDiv.addEventListener("click", () => {
      fetchActor(actor);
    });
  });
};

const renderActor = (actor) => {
  CONTAINER.innerHTML = "";
  CONTAINER.classList.add("container");
  const actorDiv = document.createElement("div");
  actorDiv.classList.add("actorDiv");
  console.log(actor);
  actorDiv.innerHTML = `
  <div class="profile">
    <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="" />
  </div>
  <div class="info">
    <h2>${actor.name}</h2>
    
    <p>Gender: ${actor.gender === 1 ? "Woman" : "Man"}</p>
    <p>Birthday: ${actor.birthday}</p>
    <p>Biography: ${actor.biography}</p>
    
  </div>
  
`;
CONTAINER.appendChild(actorDiv);
};

const fetchSearch = async (query) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&query=${query}`;
  const res = await fetch(url);
  return res.json();
};

const searchDetails = async (query) => {
  const searchRes = await fetchSearch(query);
  return searchRes;
};

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const searchResults = () => {
  searchDetails(searchInput.value).then((data) => {
    console.log(renderMovies(data.results));
    // data.results.map((movie) => {
    //   console.log(movie);
    //   // if(res.title == searchInput.value)
    //   CONTAINER.innerHTML = `
    //   <h1>${movie.title}</h1>
    //   `;
    // });
  });
  // return CONTAINER;
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

const fetchRelated = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};

const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};

const naji = (genresid) => {
  // console.log(genresid);
  genresid.forEach((genreid) => {
    // console.log(genreid);
    return genreid;
  });
};

// const renderGender = (genderId) => {
//   for (let i = 0; i < genderId.length; i++) {
//     fetchGenreByID(genderId[i].name);
//     // console.log(genderId[i])
//   }
// };

// console.log(fetchGenreByID());

const renderActorsss = (actors) => {
  let container = "";
  actors.cast.slice(0, 5).map((actor) => {
    container += `
    <li><a id=${actor.id} href="#">${JSON.stringify(
      actor.name
    )}</a> as ${JSON.stringify(actor.character)}</li>
    
    `;
  });
  return container;
};

const renderRelated = (movies) => {
  let container = "";
  movies.results.slice(0, 5).map((similar) => {
    container += `<li> ${similar.original_title} </li>`;
  });
  return container;
};

const renderTrailer = (movies) => {
  let container = "";
  movies.results.map((trailer) => {
    container = `<iframe width="420" height="315"
    src="https://www.youtube.com/embed/${trailer.key}">
    </iframe>`;
  });
  return container;
};

const renderComp = (movies) => {
  let container = "";
  movies.production_companies.map((company) => {
    container = `<h5>${company.name}</h5> <img id="movie-backdrop" src="${
      BACKDROP_BASE_URL + company.logo_path
    }">`;
  });
  return container;
};

const renderDirector = (movies) => {
  let container = "";
  movies.crew.map((director) => {
    if (director.job === "Director") {
      container = `<p>${director.name}</p>`;
    }
  });
  return container;
};

// const renderActor = (actorID) => {
//   const actors = document.querySelectorAll("a");
//   for (let i = 0; i < actors.length; i++) {
//     actors[i].addEventListener("click", (event) => {
//       event.preventDefault();
//       fetchActorByID(actorID, actors[i].id);
//     });
//   }
// };

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movieRes, movieActors, movieRelated, movieTrailer) => {
  const actors = renderActorsss(movieActors);
  const similar = renderRelated(movieRelated);
  const trailer = renderTrailer(movieTrailer);
  const productionComp = renderComp(movieRes);
  const directorName = renderDirector(movieActors);

  CONTAINER.innerHTML = `
  <div class="card">
    <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src="${
            BACKDROP_BASE_URL + movieRes.backdrop_path
          }" height="500px" width="300px">
        </div>
        <div class="col-md-8">
            <h1 id="movie-title">${movieRes.title}</h1>
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
        <div>
        <h2> Trailer: </h2>
        ${trailer}
        </div>
        <h3>Production Companies:</h3>
        <ul id="prod" class="list-unstyled">
        ${productionComp}
        </ul>
        <h3>Director Name:</h3>
        <ul id="dir" class="list-unstyled">
        ${directorName}
        </ul>
        </div>
        </div>
    </div>
    </div>`;
  renderActor(movieActors.id);
};

document.addEventListener("DOMContentLoaded", autorun);
