const APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIURL = 'https://api.themoviedb.org/3/';
const imgPath = 'https://image.tmdb.org/t/p/w500';
const main = document.querySelector('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const footerDiv = document.getElementById('footerDiv');
const chevll = document.getElementById('chevll');
const chevl = document.getElementById('chevl');
const chevrr = document.getElementById('chevrr');
const chevr = document.getElementById('chevr');
const GridType = document.getElementById('gridType')
const ListType = document.getElementById('listType')


let CurrentPageUrl;
let CurrentPageType;
let CurrentPageNo;
// window.addEventListener('load', (event) => {
//     console.log('page is fully loaded');
// });

// setting default PageTypeButtons
GridType.classList.add('activeType')

GridType.addEventListener('click', e => {
    if (CurrentPageType != 'grid') {
        CurrentPageType = 'grid';
        getMovies(CurrentPageUrl, type = CurrentPageType)
        GridType.classList.toggle('activeType');
        ListType.classList.toggle('activeType');
    }
})

ListType.addEventListener('click', e => {
    if (CurrentPageType != 'list') {
        CurrentPageType = 'list';
        getMovies(CurrentPageUrl, type = CurrentPageType)
        GridType.classList.toggle('activeType');
        ListType.classList.toggle('activeType');
    }
})

// https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=2067

getMovies(`${APIURL}discover/movie?sort_by=popularity.desc&api_key=${APIKEY}&page=`, 'grid');

// SEARCH
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchterm = search.value;
    const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${searchterm}&page=`

    if (searchterm) {
        getMovies(searchURL, 'list')
        CurrentPageType = 'list';
        search.value = '';
    }
})


async function getMovies(BaseURL, type = 'grid', pageno = '1') {
    CurrentPageNo = parseInt(pageno);
    const resp = await fetch(BaseURL + pageno);
    const respData = await resp.json();
    console.log(respData);
    pages = [respData.page, respData.total_pages, respData.results.length, respData.total_results];
    console.log(pages);
    if (type === 'grid') {
        CurrentPageType = 'grid';
        showGridMovies(respData.results, pages);
    }
    else if (type === 'list') {
        CurrentPageType = 'list';
        // showListMovie(respData.results, pages);
        // clear main
        main.innerHTML = '';
        respData.results.forEach(movie => {
            getMovie(movie.id);
        });
        console.log('ho gaya');
        // clear footer
        footerDiv.innerHTML = '';
        const footerEl = document.createElement('footer');
        footerEl.classList.add('footer')
        footerEl.innerHTML = `<h3 class="showing">Showing ${pages[2]}/${pages[3]} results</h3>
      <h1 class="CurrentPage" id="CurrentPage">${pages[0]} /${pages[1]}</h1>`;

        footerDiv.appendChild(footerEl);
    }
    CurrentPageUrl = BaseURL;
    window.addEventListener('load', (event) => {
        console.log('page is fully loaded');
    });
}

async function getMovie(Movieid) {
    // console.log(Movieid);
    const resp = await fetch(APIURL + `movie/${Movieid}?api_key=${APIKEY}&language=en-US`);
    const respData = await resp.json();
    // console.log(respData);
    showListMovie(respData)

}
// getMovie("724989");
function showGridMovies(movies, pages) {
    //clear main
    main.innerHTML = '';

    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        if (movie.poster_path) {
            CoverPath = imgPath + movie.poster_path;
        } else {
            CoverPath = 'https://icon-library.net/images/no-picture-available-icon/no-picture-available-icon-4.jpg'
        }
        movieEl.innerHTML = `
    <img
        src="${CoverPath}"
        alt="${movie.title}"
        />
        <div class="movie-info">
        <h3>${movie.title}</h3>
        <span class="${getClassByRate(movie.vote_average)}">${movie.vote_average}</span>
        `
        main.appendChild(movieEl);

    });
    // clean footer
    footerDiv.innerHTML = '';
    const footerEl = document.createElement('footer');
    footerEl.classList.add('footer')
    footerEl.innerHTML = `<h3 class="showing">Showing ${pages[2]}/${pages[3]} results</h3>
      <h1 class="CurrentPage" id="CurrentPage">${pages[0]} /${pages[1]}</h1>`;

    footerDiv.appendChild(footerEl);
}

function showListMovie(movie) {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie-list');
    if (movie.poster_path) {
        CoverPath = imgPath + movie.poster_path;
    } else {
        CoverPath = 'https://icon-library.net/images/no-picture-available-icon/no-picture-available-icon-4.jpg'
    }
    movieEl.innerHTML = `
        <img
          src="${CoverPath}"
          alt="${movie.title}"
        />
        <button class="chev" id="bookmark">
          <i class="far fa-bookmark"></i>
        </button>

        <div class="movie-info">
          <h3 id="title">${movie.title}</h3>
          <h5 id="time">${movie.runtime != 0 ? movie.runtime : '-'} mins</h5>
          <h4 id="tagline"><i>${movie.tagline}</i></h4>
          <div class="tags">
            <span class="${getClassByRate(movie.vote_average)}">${movie.vote_average}</span>
            ${getGenreTags(movie.genres)}
          </div>
          <div class="release">
            <span>Release Date : ${movie.release_date}</span>
            <span>Status : ${movie.status}</span>
          </div>
          <h3>Overview</h3>
          <p id="overview">${movie.overview}</p>
        </div>
        `;
    main.appendChild(movieEl);
    movieEl.style.background = `linear-gradient(to bottom,rgba(0, 0, 0, 0.6),rgba(6, 21, 61, 0.9)),
    url('${imgPath + movie.backdrop_path}') center/cover no-repeat`;
}

function getGenreTags(genres) {
    let GenreSpan = ''
    genres.forEach(e => {
        GenreSpan += '<span class="tag">' + e.name + '</span>\n'
    });
    return GenreSpan;
}
function getClassByRate(rate) {
    if (rate >= 8) {
        return 'green';
    } else if (rate >= 6) {
        return 'yellow';
    } else {
        return 'red';
    }
}


chevll.addEventListener('click', () => {
    getMovies(CurrentPageUrl, CurrentPageType, 1);
    document.documentElement.scrollTop = 0;
    console.log(CurrentPageNo);

})
chevl.addEventListener('click', () => {
    if (1 < CurrentPageNo && CurrentPageNo <= pages[1]) {
        getMovies(CurrentPageUrl, CurrentPageType, CurrentPageNo - 1)
        console.log(CurrentPageNo);
        document.documentElement.scrollTop = 0;
    } else {
        document.getElementById('CurrentPage').classList.add('red');
    }
})
chevr.addEventListener('click', () => {

    // const length = CurrentPageUrl.length;
    // console.log(typeof (parseInt(CurrentPageUrl.charAt(length - 1))));
    // console.log(CurrentPageUrl.slice(0, -1));
    if (CurrentPageNo < pages[1]) {
        getMovies(CurrentPageUrl, CurrentPageType, CurrentPageNo + 1)
        console.log(CurrentPageNo);
        document.documentElement.scrollTop = 0;
    } else {
        document.getElementById('CurrentPage').classList.add('red');
    }
})
chevrr.addEventListener('click', () => {
    getMovies(CurrentPageUrl, CurrentPageType, pages[1]);
    document.documentElement.scrollTop = 0;
    console.log(CurrentPageNo);

})

