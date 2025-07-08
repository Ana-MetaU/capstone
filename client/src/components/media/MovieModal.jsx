import {useEffect, useState} from "react";
import {addWatchedMovie} from "../../api/MovieApi";
import {Rating} from "react-simple-star-rating";
import "./MovieModal.css";

// TODO : handle currently watching. Currently watching may not be relevant for movies, so definitely will do so for shows.
const MovieModal = ({isOpen, onClose, movie}) => {
  const [watchStatus, setWatchStatus] = useState("Watched");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setWatchStatus("watched");
    setReview("");
    setRating(false);
  }, [movie]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleStatusChange = (e) => {
    setWatchStatus(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    const movieData = {
      tmdbId: parseInt(movie.id),
      posterPath: movie.poster_path,
      rating: parseInt(rating),
      review: review,
    };

    const result = await addWatchedMovie(movieData);
    if (result.success) {
      console.log("movie added");
      onClose();
    } else {
      alert(result.message);
    }
  };
  return (
    <div className="modal-backdrop">
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="movie-modal">
            <button className="close-button" onClick={onClose}>
              &times;
            </button>

            <div className="modal-content">
              <div className="modal-layout">
                {/* Left side */}
                <div className="poster-section">
                  <div className="movie-poster">
                    <img
                      src={
                        movie.poster_path
                          ? "https://image.tmdb.org/t/p/w500" +
                            `${movie.poster_path}`
                          : "/image.png"
                      }
                    />
                  </div>
                </div>

                {/* Right side */}
                <div className="content-section">
                  {/* Top section - buttons, title, year */}
                  <div className="movie-info">
                    <h2 className="title">{movie.title}</h2>
                    <p className="year">
                      Release year: {movie.release_date.split("-")[0]}{" "}
                    </p>
                  </div>

                  {/* Dropdown and heart row */}
                  <div className="actions">
                    <div className="dropdown-section">
                      <select
                        className="status-select"
                        value={watchStatus}
                        onChange={handleStatusChange}
                      >
                        <option value="Watched"> Watched </option>
                        {/* TODO: handle watching as an option. I have to analyze what's the best way to implement it together with the watched */}
                      </select>
                    </div>
                  </div>

                  {/* Stars section */}
                  <div className="rating">
                    <Rating
                      onClick={handleRatingChange}
                      ratingValue={rating}
                      size={24}
                      fillColor="#ffd700"
                      iconsCount={5}
                    />
                  </div>

                  {/* Review section */}
                  <div className="review-section">
                    <textarea
                      className="review-textarea"
                      placeholder="write a review (optional)"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      maxLength={500}
                    ></textarea>
                  </div>
                  <button className="submit-button" onClick={handleSubmit}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieModal;
