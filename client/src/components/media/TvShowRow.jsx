import {useContext} from "react";
import TvShowCard from "./TvShowCard";
import {TVShowContext} from "../../context/TvShowContext";
import "./MovieRow.css";

const tvShowRow = ({tvShows, title}) => {
  const {openModal} = useContext(TVShowContext);

  const renderMovies = () => {
    if (!tvShows || tvShows.length === 0) {
      return <p className="no-movies">No TV shows available.</p>;
    }

    return tvShows.map((tvShow) => (
      <TvShowCard
        key={tvShow.id}
        props={tvShow}
        onClick={() => openModal(tvShow)}
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

export default tvShowRow;
