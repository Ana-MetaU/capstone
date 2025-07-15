import {useContext} from "react";
import {MovieContext} from "../../context/MovieContext";
import MovieCard from "./MovieCard";
import "./MovieRow.css";

const MovieRow = ({movies, title}) => {
  const {openModal} = useContext(MovieContext);

  const renderMovies = () => {
    if (!movies || movies.length === 0) {
      return <p className="no-movies">No movies available.</p>;
    }

    return movies.map((movie) => (
      <MovieCard
        key={movie.id}
        props={movie}
        onClick={() => openModal(movie)}
      />
    ));
  };

  return (
    <div className="movie-row">
      <h2 className="section-title">{title}</h2>
      <div className="movie-row-grid">{renderMovies()}</div>
    </div>
  );
};

export default MovieRow;
