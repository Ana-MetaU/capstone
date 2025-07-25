import {useContext} from "react";
import {MovieContext} from "../../context/MovieContext";
import {
  HeartButton,
  UnHeartButton,
  WatchButton,
  UnWatchButton,
} from "../UI/Buttons";
import "./MovieCard.css";
import {getImage} from "../../utils/MediaApiUtils";

function MovieCard({props, onClick, showAction}) {
  const {toggleWantToWatch, toggleFavorite} = useContext(MovieContext);
  console.log("what", props)
  const handleFavorite = () => {
    toggleFavorite(props);
  };

  const handleWantToWatch = () => {
    console.log("props", props);
    toggleWantToWatch(props);
  };

  return (
    <div className="movie-card">
      {/* poster pic */}
      <img
        className="poster"
        onClick={onClick}
        src={getImage(props.poster_path)}
        alt={props.title}
      />

      <div className="movie-actions">
        <h3 className="movie-title">{props.title}</h3>

        {showAction && (
          <div className="movie-buttons">
            <button className="watch-button" onClick={handleWantToWatch}>
              {props.isWantToWatch ? <UnWatchButton /> : <WatchButton />}
            </button>

            <button className="favorite-button" onClick={handleFavorite}>
              {props.isFavorite ? <UnHeartButton /> : <HeartButton />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
