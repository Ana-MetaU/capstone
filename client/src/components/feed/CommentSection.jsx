import {useEffect} from "react";
import {useState} from "react";
import {addComment, getComments} from "../../api/FeedApi";
import {formatTimeAgo} from "../../utils/MediaApiUtils";
import "./CommentSection.css";
function CommentSection({watchedId}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [watchedId, submitLoading]);

  const loadComments = async () => {
    try {
      const result = await getComments(watchedId);
      if (result.success) {
        setComments(result.comments || []);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setSubmitLoading(true);

    try {
      const result = await addComment(watchedId, newComment.trim());
      if (result.success) {
        setNewComment("");
      } else {
        console.log("failed to add comment", result.error);
      }
    } catch (error) {
      console.log("error adding comment", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="comments-section">
      <form onSubmit={handleSubmit} className="add-comment-form">
        <img src="/image.png" alt="Your avatar" className="comment-avatar" />
        <div className="comment-input-container">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            maxLength={500}
            className="comment-input"
          />
          <button type="submit" className="comment-submit-btn">
            {submitLoading ? "Posting" : "Post"}
          </button>
        </div>
      </form>
      {loading ? (
        <p> laoding comments...</p>
      ) : (
        <>
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">No comments yet</div>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <img
                    src={comment.profilePicture || "/image.png"}
                    alt={comment.username}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-username">
                        {comment.username}
                      </span>
                      <span className="comment-time">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CommentSection;
