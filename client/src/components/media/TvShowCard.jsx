import {useContext} from "react";
import {getImage} from "../../utils/MediaApiUtils";
import {
  HeartButton,
  UnHeartButton,
  WatchButton,
  UnWatchButton,
} from "../UI/Buttons";
import "./MovieCard.css";

import {TVShowContext} from "../../context/TvShowContext";
function TvShowCard({props, onClick}) {
  const {toggleWantToWatch, toggleFavorite} = useContext(TVShowContext);

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
        src={props.image ? `${getImage(props.image)}` : "/notfound.png"}
        alt={props.name}
      />

      <div className="movie-actions">
        <h3 className="movie-title">{props.name}</h3>
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

export default TvShowCard;
