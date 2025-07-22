import {useContext} from "react";
import {MovieContext} from "../../context/MovieContext";
import {useNavigate} from "react-router-dom";
import Trailer from "./Trailer";
import "./MovieDetails.css";
import {getImage} from "../../utils/MediaApiUtils";

function MovieDetails() {
  const navigate = useNavigate();
  const {movieDetail,selectedMovie, closeModal} = useContext(MovieContext);
  if (!selectedMovie) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleWriteReview = () => {
    navigate(`/review/${selectedMovie.id}`);
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
                src={getImage(movieDetail.poster_path)}
                alt="Movie poster"
                className="movie-poster-details"
              />
              <button className="review-btn" onClick={handleWriteReview}>
                Write Review
              </button>
            </div>

            <div className="details-column">
              <div className="movie-header">
                <h1 className="movie-title-details">{movieDetail.title}</h1>
                <div className="movie-info">
                  <span className="movie-year">
                    Year: {movieDetail.release_date?.slice(0, 4)}
                  </span>
                  <span className="movie-runtime">
                    Runtime: {movieDetail.runtime} min
                  </span>
                  <span className="movie-genres">
                    {movieDetail.genres?.map((g) => g.name).join(", ")}
                  </span>
                </div>
                <div className="rating-container">
                  <span className="rating-score">
                    Rating: {Math.floor(movieDetail.vote_average)}/10
                  </span>
                  <span className="vote-count">
                    ({movieDetail.vote_count} votes)
                  </span>
                </div>
              </div>

              <div className="overview-section">
                <h3>Overview</h3>
                <p className="overview-text">{movieDetail.overview}</p>
              </div>
            </div>
          </div>

          <div className="trailer-section">
            <h3>Official Trailer</h3>
            <div className="video-container">
              <Trailer></Trailer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
