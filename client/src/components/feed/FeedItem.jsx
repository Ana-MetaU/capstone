import {useState} from "react";
import {Rating} from "react-simple-star-rating";
import {CommentButton, HeartButton, UnHeartButton} from "../UI/Buttons";
import {useFeed} from "../../context/FeedContext";
import {formatTimeAgo, getImage} from "../../utils/MediaApiUtils";
import CommentSection from "./CommentSection";
import "./Feed.css";
function FeedItem({FeedItem}) {
  const [showComments, setShowComments] = useState(false);
  const {watchedId, friend, content, rating, interactions} = FeedItem;
  const {toggleLike} = useFeed();
  
  const getAction = () => {
    if (rating.review) {
      return `reviewed ${content.title}`;
    } else {
      return `rated ${content.title}`;
    }
  };

  const handleCommentClick = () => {
    console.log("what is going on", showComments);
    setShowComments((prev) => !prev);
  };

  const handleLikeClick = () => {
    toggleLike(watchedId, interactions.userLiked);
  };
  return (
    <div className="feed-item">
      <div className="feed-item-header">
        <div className="friend-info">
          {friend.profilePicture ? (
            <img
              className="friend-avatar"
              src={friend.profilePicture}
              alt={friend.username}
            />
          ) : (
            <img
              src="/image.png"
              alt={friend.username}
              className="friend-avatar"
            />
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
        <span className="post-age">{formatTimeAgo(rating.watchedAt)}</span>
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
        <button className="action-button" onClick={handleLikeClick}>
          {interactions.userLiked ? (
            <UnHeartButton></UnHeartButton>
          ) : (
            <HeartButton></HeartButton>
          )}
          <span> {interactions?.likesCount} </span>
        </button>

        <button className="action-button" onClick={handleCommentClick}>
          <CommentButton></CommentButton>
          <span>{interactions?.commentCount}</span>
        </button>
      </div>
      {showComments && <CommentSection watchedId={watchedId}></CommentSection>}
    </div>
  );
}

export default FeedItem;
