import {useContext, useState} from "react";
import {MovieContext} from "../../context/MovieContext";
import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";
import "./MovieGrid.css";

const MovieGrid = () => {
  const {movies, openModal, closeModal, selectedMovie} =
    useContext(MovieContext);

  const renderCards = () => {
    if (movies.length === 0) {
      return <p>No movies found.</p>;
    } else {
      return movies.map((movie, index) => (
        <MovieCard key={index} props={movie} onClick={() => openModal(movie)} />
      ));
    }
  };

  return (
    <div className="movie-grid-parent">
      <h2>Movies</h2>
      <div className="movie-grid">{renderCards()}</div>
      <MovieModal
        isOpen={!!selectedMovie}
        onClose={closeModal}
        movie={selectedMovie}

      ></MovieModal>
    </div>
  );
};

export default MovieGrid;
