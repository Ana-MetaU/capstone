import {useState, useEffect} from "react";
import {getFavoriteMovies} from "../../api/MovieApi";

const FavoriteMovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchedMovies();
  }, []);

  const fetchWatchedMovies = async () => {
    const result = await getFavoriteMovies();
    console.log("result from favorites", result);
    if (result.success) {
      setMovies(result.movies);
    } else {
      console.log("Failed to fetch watched movies:", result.message);
    }
    setLoading(false);
  };

  const renderCards = () => {
    if (loading) {
      return <p className="loading">Loading your watched movies...</p>;
    }

    if (!movies || movies.length === 0) {
      return <p className="no-movies">No favorited movies yet</p>;
    }

    return movies.map((movie, index) => (
      <div key={`${movie.tmdbId}-${index}`} className="watched-movie-card">
        <img
          className="watched-movie-poster"
          src={
            movie.posterPath
              ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
              : "/image.png"
          }
          alt={movie.title || "Movie"}
        />
      </div>
    ));
  };

  return (
    <div className="watched-movies-container">
      <h2>Favorite Movies</h2>
      <div className="watched-movies-grid">{renderCards()}</div>
    </div>
  );
};

export default FavoriteMovieGrid;
