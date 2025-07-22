import {useContext} from "react";
import {TVShowContext} from "../../context/TvShowContext";
import {useNavigate} from "react-router-dom";
import {getImage} from "../../utils/MediaApiUtils";
import "./MovieDetails.css";

function TVShowDetails() {
  const navigate = useNavigate();
  const {selectedTVShow, closeModal} = useContext(TVShowContext);

  const showData = {...selectedTVShow};
  if (!selectedTVShow) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleWriteReview = () => {
    navigate(`/tv-review/${selectedTVShow.id}`, {
      state: {tvShow: {...showData}},
    });
  };

  return (
    <div className="movie-details-backdrop" onClick={handleOverlayClick}>
      <div className="movie-details-modal">
        <button className="modal-close-btn" onClick={closeModal}>
          &times;
        </button>
        <div className="modal-body">
          <div className="content-grid">
            <div className="poster-section">
              <img
                src={getImage(selectedTVShow.image || "")}
                alt="TV Show poster"
                className="movie-poster-details"
              />
              <button className="review-btn" onClick={handleWriteReview}>
                Write Review
              </button>
            </div>
            <div className="details-column">
              <div className="movie-header">
                <h1 className="movie-title-details">{selectedTVShow.name}</h1>
                <div className="movie-info">
                  <span className="movie-year">
                    Year:{" "}
                    {selectedTVShow.firstAired?.slice(0, 4) ||
                      selectedTVShow.year}
                  </span>
                  {selectedTVShow.number_of_seasons && (
                    <span className="movie-runtime">
                      Seasons: {selectedTVShow.number_of_seasons}
                    </span>
                  )}
                  {selectedTVShow.number_of_episodes && (
                    <span className="movie-runtime">
                      Episodes: {selectedTVShow.number_of_episodes}
                    </span>
                  )}
                  {selectedTVShow.averageRuntime && (
                    <span className="movie-runtime">
                      average runtime: {selectedTVShow.averageRuntime}
                    </span>
                  )}
                  {selectedTVShow.status && (
                    <span className="movie-runtime">
                      status: {selectedTVShow.status.name}
                    </span>
                  )}
                </div>
                <div className="rating-container">
                  <span className="rating-score">
                    Rating:{" "}
                    {Math.floor(
                      selectedTVShow.vote_average || selectedTVShow.rating || 0
                    )}
                    /10
                  </span>
                  {selectedTVShow.vote_count && (
                    <span className="vote-count">
                      ({selectedTVShow.vote_count} votes)
                    </span>
                  )}
                </div>
              </div>
              <div className="overview-section">
                <h3>Overview</h3>
                <p className="overview-text">
                  {selectedTVShow.overview || selectedTVShow.description}
                </p>
              </div>
              {selectedTVShow.networks &&
                selectedTVShow.networks.length > 0 && (
                  <div className="overview-section">
                    <h3>Network</h3>
                    <p className="overview-text">
                      {selectedTVShow.networks.map((n) => n.name).join(", ")}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TVShowDetails;
