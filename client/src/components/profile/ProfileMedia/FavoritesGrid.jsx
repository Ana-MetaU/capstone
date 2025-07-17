import {useState, useEffect} from "react";
import {
  getUserFavoriteMovies,
  getUserFavoriteShows,
} from "../../../api/UsersApi";
import {getImage} from "../../../utils/MediaApiUtils";
import "../../media/MovieGrid.css";
const FavoritesGrid = ({userId}) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const movies = await getUserFavoriteMovies(userId);
    const shows = await getUserFavoriteShows(userId);

    if (movies.success && shows.success) {
      console.log("tadda", movies, shows);
      const all = [...movies.movies, ...shows.shows];
      setFavorites((prevItems) => [...prevItems, ...all]);
    } else {
      console.log("Failed to fetch watched movies:", movies.message);
    }
    setLoading(false);
  };

  const renderCards = () => {
    if (loading) {
      return <p className="loading">Loading favorite shows and movies...</p>;
    }

    if (!favorites || favorites.length === 0) {
      return <p className="no-movies">No favorited movies or shows yet</p>;
    }

    return favorites.map((item, index) => (
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
      <h2>Favorites</h2>
      <div className="movies-grid">{renderCards()}</div>
    </div>
  );
};

export default FavoritesGrid;
