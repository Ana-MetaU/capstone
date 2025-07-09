import {useContext} from "react";
import {MovieContext} from "../../context/MovieContext";
import {
  HeartButton,
  UnHeartButton,
  WatchButton,
  UnWatchButton,
} from "../UI/Buttons";
import "./MovieCard.css";

function MovieCard({props, onClick}) {
  const {toggleWantToWatch, toggleFavorite} = useContext(MovieContext);

  const handleFavorite = () => {
    toggleFavorite(props);
  };

  const handleWantToWatch = () => {
    toggleWantToWatch(props);
  };
  
  return (
    <div className="movie-card">
      {/* poster pic */}
      <img
        className="poster"
        onClick={onClick}
        src={
          props.poster_path
            ? "https://image.tmdb.org/t/p/w500" + `${props.poster_path}`
            : "/image.png"
        }
        alt={props.title}
      />

      <div className="movie-actions">
        <h3 className="movie-title">{props.title}</h3>
        <div className="movie-buttons">
          <button className="watch-button" onClick={handleWantToWatch}>
            {props.isWantToWatch ? <UnWatchButton /> : <WatchButton />}
          </button>

          <button className="favorite-button" onClick={handleFavorite}>
            {props.isFavorite ? <UnHeartButton /> : <HeartButton />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
