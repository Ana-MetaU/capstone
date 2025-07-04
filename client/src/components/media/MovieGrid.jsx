import {useContext} from "react";
import { MovieContext } from "../../context/MovieContext";
import MovieCard from "./MovieCard";
import "./MovieGrid.css";

const MovieGrid = () => {
  const {movies} = useContext(MovieContext);

  const renderCards = () => {
    if (movies.length === 0) {
      return <p>No movies found.</p>;
    } else {
      return movies.map((movie, index) => (
        <MovieCard key={index} props={movie} />
      ));
    }
  };

  return (
    <div className="movie-grid-parent">
      <h2>Movies</h2>
      <div className="movie-grid">{renderCards()}</div>
    </div>
  );
};

export default MovieGrid;
