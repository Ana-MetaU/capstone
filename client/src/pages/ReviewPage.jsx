import {useEffect, useState, useContext} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {MovieContext} from "../context/MovieContext";
import {addWatchedMovie} from "../api/MovieApi";
import {Rating} from "react-simple-star-rating";
import {getImage} from "../utils/MediaApiUtils";
import "./ReviewPage.css";

const ReviewPage = () => {
  const navigate = useNavigate();
  const {movieId} = useParams();
  const {fetchMovieDetails} = useContext(MovieContext);
  const [movieDetails, setMovieDetails] = useState(null);
  const [watchStatus, setWatchStatus] = useState("Watched");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      const data = await fetchMovieDetails(movieId);
      setMovieDetails(data);
      setLoading(false);
    };
    loadMovie();
  }, [movieId]);

  const handleStatusChange = (e) => {
    setWatchStatus(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  const handleSubmit = async () => {
    const movieData = {
      tmdbId: parseInt(movieId),
      posterPath: movieDetails.poster_path,
      title: movieDetails.title,
      overview: movieDetails.overview,
      rating: parseInt(rating),
      review,
    };

    const result = await addWatchedMovie(movieData);
    if (result.success) {
      navigate("/");
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (!movieDetails) {
    return <div className="error">Movie not found</div>;
  }

  return (
    <div className="review-page">
      <div className="review-page-container">
        <div className="header">
          <h1>Write Review</h1>
        </div>
        <div className="movie-info">
          <img
            src={getImage(movieDetails.poster_path)}
            alt={movieDetails.title}
          />
          <div className="movie-info-right">
            <h2>{movieDetails.title}</h2>
            <p>{movieDetails.release_date?.slice(0, 4)}</p>

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

            <div className="rating">
              <Rating
                onClick={handleRatingChange}
                ratingValue={rating}
                size={24}
                fillColor="#ffd700"
                iconsCount={5}
              />
            </div>
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
      </div>
    </div>
  );
};

export default ReviewPage;
