"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");
const homeBtn = document.querySelector(".home-btn");

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

const fetchSearch = async (query) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&query=${query}`;
  const res = await fetch(url);
  return res.json();
};

const fetchGenre = async () => {
  const url = constructUrl("genre/movie/list");
  const res = await fetch(url);
  const data = await res.json();
  return data['genres']
  ;}

const searchDetails = async (query) => {
  const searchRes = await fetchSearch(query);
  return searchRes;
};
// search part
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const searchResults = () => {
  searchDetails(searchInput.value).then((data) => {
    console.log( renderMovies(data.results));
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



//genre part (if i write genre one more time i will puke)
const genreDiv = document.getElementById("navbarDropdownGenre");
const genreResults = async () => {
  const genreList = await fetchGenre();
  const genreListDiv = document.createElement("ul")
  genreListDiv.setAttribute("class", "DropDownGenreList")
  genreDiv.appendChild(genreListDiv);
  for (let element in genreList) {
    const eachGenre = document.createElement("li");
    eachGenre.textContent = genreList[element].name;
    genreListDiv.appendChild(eachGenre);
    document.querySelector(".DropDownGenreList").style.display = "none";
  }
}
genreResults();
genreDiv.addEventListener('mouseover', function(e) {
  //console.log("mouse");
  e.preventDefault();
  document.querySelector(".DropDownGenreList").style.display = "block";
  });
genreDiv.addEventListener('mouseout', function(){
  document.querySelector(".DropDownGenreList").style.display = "none";
  //console.log("mouse out!")
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
      CONTAINER.innerHTML = `
      <div class="card">
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

const naji = (genresid) => {
  // console.log(genresid);
  genresid.forEach((genreid) => {
    // console.log(genreid);
    return genreid;
  });
};

const fetchGenres = async () => {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
  const res = await fetch(url);
  return res.json();
};

const genresDetails = async () => {
  const genresRes = await fetchGenres();
  return genresRes;
};

const fetchGenreByID = () => {
  // let container = "";
  genresDetails().then((data) => {
    // console.log(data);
    data.genres.map((genre) => {
      // console.log(genre);
      //  genre.name;
      //  if (genreId == genre.id) {
      // container = genre.name;
      //  }
      // return container;
    });
  });
};

// const renderGender = (genderId) => {
//   for (let i = 0; i < genderId.length; i++) {
//     fetchGenreByID(genderId[i].name);
//     // console.log(genderId[i])
//   }
// };

// console.log(fetchGenreByID());

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

  CONTAINER.innerHTML = `
  <div class="card">
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
    </div>
    </div>`;
  renderActor(movieActors.id);
};

document.addEventListener("DOMContentLoaded", autorun);

homeBtn.addEventListener("click", () => {
  CONTAINER.innerHTML = "";

  autorun();
});