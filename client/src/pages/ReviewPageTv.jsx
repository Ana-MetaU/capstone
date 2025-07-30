import {useEffect, useState, useContext} from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {Rating} from "react-simple-star-rating";
import {getImage} from "../utils/MediaApiUtils";
import ErrorModal from "../components/UI/ErrorModal";
import "./ReviewPage.css";
import {
  addWatchedTVShow,
  getCurrentlyWatchingTVShows,
  addCurrentlyWatchingTVShows,
} from "../api/TVShowApi";

const ReviewPageTv = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {showId} = useParams();
  const show = location.state?.tvShow;
  const [watchStatus, setWatchStatus] = useState("Watched");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setWatchStatus("Watched");
    setReview("");
    setRating(false);
  }, [show]);

  const handleStatusChange = (e) => {
    console.log("whats the value", e.target.value);
    setWatchStatus(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    let showData;
    let result;
    if (watchStatus === "Watched") {
      showData = {
        tvdbId: parseInt(showId),
        posterPath: show.image,
        name: show.name,
        overview: show.overview,
        rating: parseInt(rating),
        review: review,
      };
      result = await addWatchedTVShow(showData);
    } else {
      showData = {
        tvdbId: parseInt(showId),
        posterPath: show.image,
        name: show.name,
        overview: show.overview,
        review: review,
      };
      result = await addCurrentlyWatchingTVShows(showData);
    }

    if (result.success) {
      console.log("media added");
      navigate("/");
    } else {
      setMessage(reuslt.message);
      setIsModalOpen(true);
    }
  };
  return (
    <div className="review-page">
      <div className="review-page-container">
        <div className="header">
          <h1>Write Review</h1>
        </div>
        <div className="movie-info">
          <img src={getImage(show.image)} alt={show.name} />
          <div className="movie-info-right">
            <h2>{show.name}</h2>
            <p>{show.firstAired?.slice(0, 4)}</p>

            <div className="actions">
              <div className="dropdown-section">
                <select
                  className="status-select"
                  value={watchStatus}
                  onChange={handleStatusChange}
                >
                  <option value="Watched"> Watched </option>
                  <option value="Currently Watching">Currently Watching</option>
                </select>
              </div>
            </div>
            {watchStatus === "Watched" || !watchStatus ? (
              <div className="rating">
                <Rating
                  onClick={handleRatingChange}
                  ratingValue={rating}
                  size={24}
                  fillColor="#ffd700"
                  iconsCount={5}
                />
              </div>
            ) : (
              <div>
                <p>rating will be available once when "Watched"</p>
              </div>
            )}
          </div>
        </div>

        <div className="review-text">
          <label>Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={500}
            rows={5}
          />
          <div className="count">{review.length}/500</div>
        </div>

        <div className="buttons">
          <button onClick={() => navigate("/")} className="cancel">
            Cancel
          </button>
          <button onClick={handleSubmit} className="submit">
            Post Review
          </button>
        </div>
        <ErrorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={message}
        />
      </div>
    </div>
  );
};
export default ReviewPageTv;
