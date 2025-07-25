import {useState, useEffect} from "react";
import {
  getUserFavoriteMovies,
  getUserFavoriteShows,
} from "../../../api/UsersApi";
import {getImage} from "../../../utils/MediaApiUtils";
import MovieCard from "../../media/MovieCard";
import "../../media/MovieGrid.css";
import {useContext} from "react";
import {MovieContext} from "../../../context/MovieContext";
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
      const all = [...movies.movies, ...shows.shows];
      setFavorites(all);
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
      <MovieCard
        key={`${item.tmdbId || item.tvdbId}-${index}`}
        props={{
          ...item,
          title: item.title || item.name,
          poster_path: item.posterPath,
        }}
        onClick={() => {}}
        showAction={false}
      />
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
