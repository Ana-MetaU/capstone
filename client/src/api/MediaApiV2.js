//TODO: refactor (due by July 25)
import {removeDuplicates} from "../utils/MediaApiUtils";

const TVDB_BASE_URL = "https://api4.thetvdb.com/v4";
const ALL_GENRES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23,
  24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
];

const apiHeaders = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TVDB_TOKEN}`,
  },
};

// Get currently airing TV shows
export async function getCurrentlyAiringShows() {
  const shows = [];
  const url = `${TVDB_BASE_URL}/series/filter?status=1&sort=score&sortType=desc&lang=eng&country=usa`;

  try {
    const response = await fetch(url, apiHeaders);
    const data = await response.json();
    const sliceSize = 21;
    const maxStartIndex = Math.max(0, data.data.length - sliceSize);
    const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
    const pageShows = data.data.slice(
      randomStartIndex,
      randomStartIndex + sliceSize
    );

    shows.push(...pageShows);
  } catch (error) {
    console.error("Error fetching currently airing shows:", error);
  }

  return {
    success: true,
    shows: removeDuplicates(shows),
    rowTitle: "Currently Airing",
  };
}

// Get TV shows from a random genre
export async function getTodaysGenreShows() {
  const shows = [];

  // Pick a random genre
  const randomGenre = ALL_GENRES[Math.floor(Math.random() * ALL_GENRES.length)];
  const url = `${TVDB_BASE_URL}/series/filter?genre=${randomGenre}&sort=score&sortType=desc&lang=eng&country=usa`;

  try {
    const response = await fetch(url, apiHeaders);
    const data = await response.json();
    const sliceSize = 21;
    const maxStartIndex = Math.max(0, data.data.length - sliceSize);
    const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
    const pageShows = data.data.slice(
      randomStartIndex,
      randomStartIndex + sliceSize
    );

    shows.push(...pageShows);
  } catch (error) {
    console.error("Error fetching random genre shows:", error);
  }

  return {
    success: true,
    shows: removeDuplicates(shows),
    rowTitle: "Today's Genre Pick",
  };
}

// Get random shows from
export async function getRandomShows() {
  const shows = [];

  // Get movies from 5 random pages
  const usedPages = [];
  for (let i = 0; i < 5; i++) {
    let randomPage = Math.floor(Math.random() * 100) + 1;

    if (usedPages.includes(randomPage)) {
      randomPage = Math.floor(Math.random() * 100) + 1;
    }

    usedPages.push(randomPage);
    const url = `${TVDB_BASE_URL}/series?page=${randomPage}`;

    try {
      const response = await fetch(url, apiHeaders);
      const data = await response.json();
      const sliceSize = 5;
      const maxStartIndex = Math.max(0, data.data.length - sliceSize);
      const randomStartIndex = Math.floor(Math.random() * (maxStartIndex + 1));
      const pageShows = data.data.slice(
        randomStartIndex,
        randomStartIndex + sliceSize
      );

      shows.push(...pageShows);
      console.log("shows", shows);
    } catch (error) {
      console.error("Error fetching page:", error);
    }
  }

  return {
    success: true,
    shows: removeDuplicates(shows),
    rowTitle: "Random Shows",
  };
}

// Get all TV show rows
export async function getAllTVShowRows() {
  try {
    const [currentlyAiring, todaysGenre, randomShows] = await Promise.all([
      getCurrentlyAiringShows(),
      getTodaysGenreShows(),
      getRandomShows(),
    ]);

    return {
      success: true,
      currentlyAiring: currentlyAiring.shows,
      todaysGenre: todaysGenre.shows,
      randomShows: randomShows.shows,
    };
  } catch (error) {
    return {
      success: false,
      currentlyAiring: [],
      todaysGenre: [],
      randomShows: [],
    };
  }
}
