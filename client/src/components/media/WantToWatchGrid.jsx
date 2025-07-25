import {useState, useEffect} from "react";
import {getWantToWatchMovies} from "../../api/MovieApi";
import {getWantToWatchTVShows} from "../../api/TVShowApi";
import {getImage} from "../../utils/MediaApiUtils";
import "./MovieGrid.css";
const WantToWatchGrid = () => {
  const [wantToWatch, setWantToWatch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWantToWatch();
  }, []);

  const fetchWantToWatch = async () => {
    const movies = await getWantToWatchMovies();
    const shows = await getWantToWatchTVShows();
    if (movies.success && shows.success) {
      const all = [...movies.movies, ...shows.shows];
      setWantToWatch((prevItems) => [...prevItems, ...all]);
    } else {
      console.log("Failed to fetch want to watch movies:", result.message);
    }
    setLoading(false);
  };
  const renderCards = () => {
    if (loading) {
      return <p className="loading">Loading your watchlist...</p>;
    }

    if (!wantToWatch || wantToWatch.length === 0) {
      return <p className="no-movies">No movies in your watchlist yet</p>;
    }

    return wantToWatch.map((item, index) => (
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
      <h2>Watchlist</h2>
      <div className="movies-grid">{renderCards()}</div>
    </div>
  );
};

export default WantToWatchGrid;
