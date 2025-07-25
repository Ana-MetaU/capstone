import {
  getCurrentDate,
  getDateThreeMonthsLater,
  removeDuplicates,
} from "../utils/MediaApiUtils";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const MOVIE_GENRES = [
  28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770,
  53, 10752, 37,
];

const apiHeaders = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`,
  },
};

//
// Get movies coming to theaters in the next 3 months
//
export const searchShows = async (query) => {
  try {
   const url = `${TMDB_BASE_URL}/search/tv?query=${query}&include_adult=false&language=en-US&page=1`;
    const response = await fetch(url, apiHeaders);
    const data = await response.json();
    return {
      success: true,
      results: data.results,
    };
  } catch (error) {
    console.log("error fetching tv shows");
  }
};

export const searchMovies = async (query) => {
  try {
    const url = `${TMDB_BASE_URL}/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
    const response = await fetch(url, apiHeaders);
    const data = await response.json();
    console.log("movies data", data);
    return {
      success: true,
      results: data.results,
    };
  } catch (error) {
    console.log("error searching the movies in tmdb", error);
  }
};
export async function getComingSoonMovies() {
  const movies = [];
  const today = getCurrentDate();
  const threeMonthsFromNow = getDateThreeMonthsLater();

  const usedPages = [];
  // get movies from three random pages
  for (let i = 0; i < 3; i++) {
    let randomPage = Math.floor(Math.random() * 10) + 1;

    if (usedPages.includes(randomPage)) {
      randomPage = Math.floor(Math.random() * 10) + 1;
    }

    usedPages.push(randomPage);
    const url = `${TMDB_BASE_URL}/discover/movie?primary_release_date.gte=${today}&primary_release_date.lte=${threeMonthsFromNow}&sort_by=popularity.desc&page=${randomPage}`;

    try {
      const response = await fetch(url, apiHeaders);
      const data = await response.json();
      // generate a random slice from which to
      const sliceSize = 7;
      const maxStartIndex = Math.max(0, data.results.length - sliceSize);
      const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
      const pageMovies = data.results.slice(
        randomStartIndex,
        randomStartIndex + sliceSize
      );

      movies.push(...pageMovies);
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  }

  return {
    success: true,
    movies: removeDuplicates(movies),
    rowTitle: "Coming Soon",
  };
}

// Get movies currently playing in theaters
export async function getNowPlayingMovies() {
  const movies = [];

  // Get movies from 3 random pages
  const usedPages = [];
  for (let i = 0; i < 3; i++) {
    let randomPage = Math.floor(Math.random() * 242) + 1;
    if (usedPages.includes(randomPage)) {
      randomPage = Math.floor(Math.random() * 242) + 1;
    }

    usedPages.push(randomPage);
    const url = `${TMDB_BASE_URL}/movie/now_playing?language=en-US&page=${randomPage}`;

    try {
      const response = await fetch(url, apiHeaders);
      const data = await response.json();
      const sliceSize = 7;
      const maxStartIndex = Math.max(0, data.results.length - sliceSize);
      const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
      const pageMovies = data.results.slice(
        randomStartIndex,
        randomStartIndex + sliceSize
      );

      movies.push(...pageMovies);
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  }

  return {
    success: true,
    movies: removeDuplicates(movies),
    rowTitle: "Now Playing",
  };
}

// Get trending movies this week
export async function getPopularThisWeekMovies() {
  const movies = [];

  // Get movies from 3 random pages
  const usedPages = [];
  for (let i = 0; i < 3; i++) {
    let randomPage = Math.floor(Math.random() * 500) + 1;
    if (usedPages.includes(randomPage)) {
      randomPage = Math.floor(Math.random() * 500) + 1;
    }
    usedPages.push(randomPage);
    const url = `${TMDB_BASE_URL}/trending/movie/week?language=en-US&page=${randomPage}`;

    try {
      const response = await fetch(url, apiHeaders);
      const data = await response.json();
      const sliceSize = 7;
      const maxStartIndex = Math.max(0, data.results.length - sliceSize);
      const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
      const pageMovies = data.results.slice(
        randomStartIndex,
        randomStartIndex + sliceSize
      );
      movies.push(...pageMovies);
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  }

  return {
    success: true,
    movies,
    rowTitle: "Popular This Week",
  };
}

// Get hidden gem movies from different genres
export async function getHiddenGemsMovies() {
  const movies = [];

  // Get 2 movies from each genre
  for (const genreId of MOVIE_GENRES) {
    const randomPage = Math.floor(Math.random() * 5) + 1;
    const url = `${TMDB_BASE_URL}/discover/movie?with_genres=${genreId}&vote_average.gte=7.5&vote_count.gte=500&sort_by=vote_average.desc&page=${randomPage}`;

    try {
      const response = await fetch(url, apiHeaders);
      const data = await response.json();
      const sliceSize = 2;
      const maxStartIndex = Math.max(0, data.results.length - sliceSize);
      const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
      const pageMovies = data.results.slice(
        randomStartIndex,
        randomStartIndex + sliceSize
      );
      movies.push(...pageMovies);
    } catch (error) {
      console.error("Error fetching genre movies:", error);
    }
  }
  return {
    success: true,
    movies: removeDuplicates(movies),
    rowTitle: "Hidden Gems",
  };
}

// Get all movie rows
export async function getAllMovieRows() {
  try {
    const [comingSoon, nowPlaying, hiddenGems, popularWeek] = await Promise.all(
      [
        getComingSoonMovies(),
        getNowPlayingMovies(),
        getHiddenGemsMovies(),
        getPopularThisWeekMovies(),
      ]
    );

    return {
      success: true,
      comingSoon: comingSoon.movies,
      nowPlaying: nowPlaying.movies,
      hiddenGems: hiddenGems.movies,
      popularWeek: popularWeek.movies,
    };
  } catch (error) {
    return {
      success: false,
      comingSoon: [],
      nowPlaying: [],
      hiddenGems: [],
      popularWeek: [],
    };
  }
}
