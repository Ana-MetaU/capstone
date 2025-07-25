import {useState, useEffect} from "react";
import {getUserWatchedMovies, getUserWatchedShows} from "../../../api/UsersApi";
import {getImage} from "../../../utils/MediaApiUtils";
import "../../media/MovieGrid.css";
const WatchedGrid = ({userId}) => {
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatched();
  }, []);

  const fetchWatched = async () => {
    const movies = await getUserWatchedMovies(userId);
    const shows = await getUserWatchedShows(userId);
    console.log("ahh", movies);
    console.log("omg", shows);
    if (movies.success && shows.success && movies.movies && shows.shows) {
      const all = [...movies.movies, ...shows.shows];
      setWatched((prevItems) => [...prevItems, ...all]);
    } else {
      console.log(
        "error fetching watched content for other usrs",
        movies.message,
        shows.message
      );
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

export default WatchedGrid;
