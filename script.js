"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  // const movieD = await fetchMovie();
  renderMovies(movies.results);
  // renderGenres(movieD);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

const fetchSearch = async (query) => {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${atob(
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
    data.results.map((res) => {
      console.log(res.title);
      CONTAINER.innerHTML = `
      <div>
      <h2>Movie Name:</h2><h5>${res.title}</h5>
      </div>
      `;
    });
  });
};

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchResults();
  searchInput.value = "";
});

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const movieActors = await fetchActor(movie.id);
  const movieRelated = await fetchRelated(movie.id);
  const movieTrailer = await fetchTrailer(movie.id);

  renderMovie(movieRes, movieActors, movieRelated, movieTrailer);
};

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

const fetchActorByID = async (movieId, actorId) => {
  const actors = await fetchActor(movieId);
  actors.cast.map((actor) => {
    if (actorId == actor.id) {
      console.log("inside if");
      CONTAINER.innerHTML = `
      <div>
    <h6>${JSON.stringify(actor.name)}</h6>
    </div>  
    <div>
    <img src="${BACKDROP_BASE_URL + actor.profile_path}" />
    </div>
    <div>
    <h4>Popularity:</h4>
    <p>${actor.popularity}</p>
    </div>
    `;
      if (actor.gender === "1") {
        CONTAINER.innerHTML += `
    <div>
      <p> Female </p>
    </div>
      `;
      } else {
        CONTAINER.innerHTML += `
    <div>
      <p> Male </p>
    </div>
      `;
      }
    }
  });
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

// const renderGenres = (movieD) => {
//   // for (let i = 0; i < movies.genres.length; i++) {
//     movieD.map((movie) => {
//       console.log(movie);
//     });
//   // }
// };

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
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
      </div>
      <div class="card-footer">
        <small class="text-muted">
        <h4>Rating:&#x2606; ${movie.vote_average}/10</h4>
        </small>
      </div>
      </div>
      </a>
    `;

    // `
    //   <div class="card col-10 col-sm-4 col-md-4 col-xl-3  px-2 pt-4 m-5 ">
    //   <b><h5 class="card-title">${movie.title}</h5></b>

    //     <img
    //         class="card-img-top"
    //         src="${PROFILE_BASE_URL + movie.backdrop_path}"
    //         alt="${movie.title}"
    //       />
    //       <div class="card-body">
    //         <p class="card-text">This.</p>
    //       </div>
    //       <div class="card-footer">
    //         <h4>Rating:</h4>
    //           &#x2606; ${movie.vote_average}/10</div>
    //     </div>

    //   </div>
    // `;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    moviesContainer.appendChild(movieDiv);
    CONTAINER.appendChild(moviesContainer);
    // CONTAINER.className += "row mx-auto justify-content-center my-5";
  });
};

const renderActors = (actors) => {
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

// const renderRating = (movies) => {
//   let container = "";
//   movies.crew.map((director) => {
//     if (director.job === "Director") {
//       container = `<p>${director.name}</p>`
//     }
//   });
//   return container;
// };

const renderActor = (actorID) => {
  const actors = document.querySelectorAll("a");
  for (let i = 0; i < actors.length; i++) {
    actors[i].addEventListener("click", (event) => {
      event.preventDefault();
      fetchActorByID(actorID, actors[i].id);
    });
  }
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movieRes, movieActors, movieRelated, movieTrailer) => {
  const actors = renderActors(movieActors);
  const similar = renderRelated(movieRelated);
  const trailer = renderTrailer(movieTrailer);
  const productionComp = renderComp(movieRes);
  const directorName = renderDirector(movieActors);
  // const rating = renderDirector(movieRating);

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
    </div>`;
  renderActor(movieActors.id);
};

document.addEventListener("DOMContentLoaded", autorun);
