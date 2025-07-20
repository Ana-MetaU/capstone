import {Rating} from "react-simple-star-rating";
import {CommentButton, HeartButton} from "../UI/Buttons";
import {getImage} from "../../utils/MediaApiUtils";
import "./Feed.css";
function FeedItem({FeedItem}) {
  const {friend, content, rating, review, watchedAt} = FeedItem;

  // format time ago
  const getAction = () => {
    if (review) {
      return `reviewed ${content.title}`;
    } else {
      return `rated ${content.title}`;
    }
  };

  return (
    <div className="feed-item">
      <div className="feed-item-header">
        <div className="friend-info">
          {friend.profilePicture ? (
            <img
              src={friend.profilePicture}
              alt={friend.username}
              className="friend-avatar"
            />
          ) : (
            <img src="/image.png" alt={friend.username} />
          )}

          <div className="friend-details">
            <span className="friend-name"> {friend.username}</span>
            <span className="action-text"> {getAction()}</span>
            {rating && (
              <Rating
                initialValue={rating.rating}
                size={24}
                fillColor="#ffd700"
                emptyColor="#cccccc"
                iconsCount={5}
                readonly={true}
                titleSeparator="out of"
              ></Rating>
            )}
          </div>
        </div>
        <span className="post-age"> 1d ago</span>
      </div>

      {rating.review && (
        <div className="review-text">
          <p>{rating.review}</p>
        </div>
      )}

      <div className="content-card">
        <div className="content-poster">
          {content.posterPath ? (
            <img
              src={getImage(content.posterPath)}
              alt={content.title}
              className="poster-image-post"
            />
          ) : (
            <img src="notfound.png" />
          )}
        </div>

        <div className="content-info">
          <h3 className="content-title"> {content.title}</h3>
          <span className="content-type">
            {" "}
            {content.type === "Movie" ? "Movie" : "TV Shows"}
          </span>

          <div className="content-description">
            <span> {content.overview}</span>
          </div>
        </div>
      </div>
      <div className="feed-item-actions">
        <button className="action-button">
          <HeartButton></HeartButton>
          <span> 24 </span>
        </button>

        <button className="action-button">
          <CommentButton></CommentButton>
          <span>10</span>
        </button>
      </div>
    </div>
  );
}

export default FeedItem;
