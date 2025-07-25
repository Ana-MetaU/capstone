import {useState, useEffect} from "react";
import {getWatchedMovies} from "../../api/MovieApi";
import {getWatchedTVShows} from "../../api/TVShowApi";
import {getImage} from "../../utils/MediaApiUtils";
import "./MovieGrid.css";
const WatchedMoviesGrid = () => {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatched();
  }, []);

  const fetchWatched = async () => {
    const movies = await getWatchedMovies();
    const shows = await getWatchedTVShows();
    if (movies.success && shows.success) {
      const all = [...movies.movies, ...shows.shows];
      setWatched((prevItems) => [...prevItems, ...all]);
    } else {
      console.log("Failed to fetch watched movies:", shows.message);
    }
    setLoading(false);
  };

  const renderCards = () => {
    if (loading) {
      return <p className="loading">Loading watched movies and shows...</p>;
    }

    if (!watched || watched.length === 0) {
      return <p className="no-movies">No watched movies or shows yet</p>;
    }

    return watched.map((item, index) => (
      <div
        key={`${item.tmdbId || item.tvdbId}-${index}`}
        className="movie-card"
      >
        <img
          className="movie-posters"
          src={getImage(item.posterPath)}
          alt={item.title || item.name}
        />
      </div>
    ));
  };

  return (
    <div className="movie-grid-parent">
      <h2>Watched Movies</h2>
      <div className="movies-grid">{renderCards()}</div>
    </div>
  );
};

export default WatchedMoviesGrid;
