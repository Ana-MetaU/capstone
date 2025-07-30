import {useContext} from "react";
import "./CurrentlyWatching.css";
import {MovieContext} from "../../context/MovieContext";
import {TVShowContext} from "../../context/TvShowContext";
import {getImage} from "../../utils/MediaApiUtils";

// TODO: update this to be currently watching from the shows api. In the modal this will ask which episode on, and will come in the feed.
// Right now it is hard coded as upcoming movies from tmdb api
function CurrentlyWatching() {
  const {currentlyWatching} = useContext(TVShowContext);
  const CurrentMovies = () => {
    if (currentlyWatching.length === 0) {
      return <p>No current movies. </p>;
    }
    return currentlyWatching.map((show) => (
      <div key={show.id} className="movie-container">
        <img
          src={getImage(show.posterPath)}
          alt={show.title}
          className="poster-image"
        />
      </div>
    ));
  };
  return (
    <div className="currently-watching">
      <h2 className="section-title"> Currently Watching</h2>
      <div className="currently-movie-grid">{CurrentMovies()}</div>
    </div>
  );
}

export default CurrentlyWatching;
