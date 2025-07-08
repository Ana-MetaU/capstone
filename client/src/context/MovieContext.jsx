import {createContext, useEffect, useState} from "react";
import {
  removeWantToWatchMovie,
  addFavoriteMovie,
  removeFavoriteMovie,
  addWantToWatchMovie,
  getFavoriteMovies,
  getWantToWatchMovies,
} from "../api/MovieApi";

const MovieContext = createContext();
function MovieProvider({children}) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [wantToWatchMovies, setWantToWatchMovies] = useState([]);

  // Load favorites from API
  const loadFavorites = async () => {
    try {
      const result = await getFavoriteMovies();
      if (result.success && result.movies) {
        setFavorites(result.movies);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Load want to watch movies from API
  const loadWantToWatchMovies = async () => {
    try {
      const result = await getWantToWatchMovies();
      if (result.success && result.movies) {
        setWantToWatchMovies(result.movies);
      }
    } catch (error) {
      console.error("Error loading want to watch movies:", error);
    }
  };

  // Add isFavorite and isWantToWatch boools to the movie objects
  const getMoviesWithFlags = () => {
    return movies.map((movie) => ({
      ...movie,
      isFavorite: favorites.filter((fav) => fav.tmdbId === movie.id).length > 0,
      isWantToWatch:
        wantToWatchMovies.filter((want) => want.tmdbId === movie.id).length > 0,
    }));
  };

  // Fetch movies from TMDB API
  // TODO: move fetch to MovieApi
  const fetchMovies = async () => {
    var url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
    var options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`,
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const newMovies = result.results;
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (movie) => {
    try {
      const movieId = movie.id;
      const isFavorited =
        favorites.filter((fav) => fav.tmdbId === movieId).length > 0;

      if (isFavorited) {
        await removeFavoriteMovie(movieId);
      } else {
        const movieData = {
          tmdbId: movieId,
          posterPath: movie.poster_path,
        };
        await addFavoriteMovie(movieData);
      }

      // Reload favorites after toggling
      await loadFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Toggle want to watch
  const toggleWantToWatch = async (movie) => {
    try {
      const movieId = movie.id;
      const isWantToWatch =
        wantToWatchMovies.filter((want) => want.tmdbId === movieId).length > 0;

      if (isWantToWatch) {
        await removeWantToWatchMovie(movieId);
      } else {
        const movieData = {
          tmdbId: movieId,
          posterPath: movie.poster_path,
        };
        await addWantToWatchMovie(movieData);
      }

      // Reload want to watch list after toggling
      await loadWantToWatchMovies();
    } catch (error) {
      console.error("Error toggling want to watch:", error);
    }
  };

  // Open and close modal
  function openModal(movie) {
    setSelectedMovie(movie);
  }
  function closeModal() {
    setSelectedMovie(null);
  }

  useEffect(() => {
    loadFavorites();
    loadWantToWatchMovies();
  }, []);

  // Fetch movies on page change
  useEffect(() => {
    fetchMovies();
  }, [page]);

  return (
    <MovieContext.Provider
      value={{
        movies: getMoviesWithFlags(),
        selectedMovie,
        setSelectedMovie,
        openModal,
        closeModal,
        toggleFavorite,
        toggleWantToWatch,
        setPage,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export {MovieContext, MovieProvider};
