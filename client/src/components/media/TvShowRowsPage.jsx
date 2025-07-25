import {useContext} from "react";
import TvShowRow from "./TvShowRow";
import {TVShowContext} from "../../context/TvShowContext";
import TVShowDetails from "./TvShowDetails";
import "./MovieRowsPage.css";

const TvShowRowsPage = () => {
  const {shows, selectedTVShow, closeModal, loading} =
    useContext(TVShowContext);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading shows...</p>
      </div>
    );
  }

  return (
    <div className="movie-rows-page">
      <div className="page-header">
        <h1>Discover TvShows</h1>
      </div>

      <div className="movie-rows-container">
        <TvShowRow tvShows={shows.currentlyAiring} title="Currently Airing" />
        <TvShowRow tvShows={shows.todaysGenre} title="Genre Roulette" />
        <TvShowRow tvShows={shows.randomShows} title="Random Shows" />
      </div>

      <TVShowDetails />
    </div>
  );
};

export default TvShowRowsPage;
