import {createContext, useEffect, useState} from "react";
import {getAllMovieRows} from "../api/MediaApi";
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
  const [moviesRows, setMoviesRows] = useState({
    comingSoon: [],
    nowPlaying: [],
    hiddenGems: [],
    popularWeek: [],
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetail, setMovieDetail] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [movieVideos, setMovieVideos] = useState([]);
  const [wantToWatchMovies, setWantToWatchMovies] = useState([]);
  const [loading, setLoading] = useState();

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
  const addFlagsToMovies = (movies) => {
    return movies.map((movie) => ({
      ...movie,
      isFavorite: favorites.filter((fav) => fav.tmdbId === movie.id).length > 0,
      isWantToWatch:
        wantToWatchMovies.filter((want) => want.tmdbId === movie.id).length > 0,
    }));
  };

  const getMoviesRowsWithFlags = () => {
    return {
      comingSoon: addFlagsToMovies(moviesRows.comingSoon),
      nowPlaying: addFlagsToMovies(moviesRows.nowPlaying),
      hiddenGems: addFlagsToMovies(moviesRows.hiddenGems),
      popularWeek: addFlagsToMovies(moviesRows.popularWeek),
    };
  };

  // Fetch movies from TMDB API
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const result = await getAllMovieRows();

      if (result.success) {
        setMoviesRows({
          comingSoon: result.comingSoon,
          nowPlaying: result.nowPlaying,
          hiddenGems: result.hiddenGems,
          popularWeek: result.popularWeek,
        });
      }
    } catch (error) {
      console.error("Error fetching movies", error);
    } finally {
      setLoading(false);
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
          title: movie.title,
          overview: movie.overview,
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
          title: movie.poster_path,
          overview: movie.poster_path,
        };
        await addWantToWatchMovie(movieData);
      }

      // Reload want to watch list after toggling
      await loadWantToWatchMovies();
    } catch (error) {
      console.error("Error toggling want to watch:", error);
    }
  };

  const fetchMovieDetails = async (id) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`,
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();
      setMovieDetail(result);
      return result;
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    if (selectedMovie && selectedMovie.id) {
      fetchMovieDetails(selectedMovie.id);
      fetchMovieVideos(selectedMovie.id);
    }
  }, [selectedMovie]);

  const fetchMovieVideos = async (id) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`,
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();

      // Filter for official trailers from YouTube
      const trailers = result.results.filter(
        (video) =>
          video.site === "YouTube" &&
          video.type === "Trailer" &&
          video.official === true
      );

      setMovieVideos(trailers);
    } catch (error) {
      console.error("Error fetching movie videos:", error);
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
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider
      value={{
        movies: getMoviesRowsWithFlags(),
        selectedMovie,
        addFlagsToMovies,
        setSelectedMovie,
        movieDetail,
        setMovieDetail,
        movieVideos,
        fetchMovieDetails,
        openModal,
        closeModal,
        toggleFavorite,
        toggleWantToWatch,
        loading,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export {MovieContext, MovieProvider};
