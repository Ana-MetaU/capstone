import {useContext} from "react";
import {MovieContext} from "../../context/MovieContext";
import MovieRow from "./MovieRow";
import MovieModal from "./MovieModal";
import "./MovieRowsPage.css";

const MovieRowsPage = () => {
  const {movies, selectedMovie, closeModal, loading} = useContext(MovieContext);
  console.log("Movies in display", movies);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="movie-rows-page">
      <div className="page-header">
        <h1>Discover Movies</h1>
      </div>

      <div className="movie-rows-container">
        <MovieRow movies={movies.comingSoon} title="Coming Soon" />
        <MovieRow movies={movies.nowPlaying} title="Now Playing" />
        <MovieRow movies={movies.popularWeek} title="Popular This Week" />
        <MovieRow movies={movies.hiddenGems} title="Hidden Gems" />
      </div>

      <MovieModal
        isOpen={!!selectedMovie}
        onClose={closeModal}
        movie={selectedMovie}
      />
    </div>
  );
};

export default MovieRowsPage;
