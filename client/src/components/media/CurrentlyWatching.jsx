import {useContext} from "react";
import "./CurrentlyWatching.css";
import {MovieContext} from "../../context/MovieContext";

// TODO: update this to be currently watching from the shows api. In the modal this will ask which episode on, and will come in the feed.
// Right now it is hard coded as upcoming movies from tmdb api
function CurrentlyWatching() {
  const {movies} = useContext(MovieContext);
  const ComingSoon = movies.comingSoon;
  const CurrentMovies = () => {
    if (!ComingSoon) {
      return <p>No current movies. </p>;
    }
    return ComingSoon.map((movie) => (
      <div key={movie.id} className="movie-container">
        <img
          src={
            movie.poster_path
              ? "https://image.tmdb.org/t/p/w500" + `${movie.poster_path}`
              : "/Graphic.png"
          }
          alt={movie.title}
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
