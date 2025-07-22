import {useEffect, useRef} from "react";
import FeedItem from "./FeedItem";
import {useFeed} from "../../context/FeedContext";
import "./Feed.css";
function Feed() {
  const {
    feedItems,
    initialLoading,
    loading,
    error,
    hasNextPage,
    fetchInitialFeed,
    loadMoreItems,
  } = useFeed();

  const sentinelRef = useRef(null);

  useEffect(() => {
    console.log("this comes through first");
    fetchInitialFeed();
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !loading &&
          !initialLoading
        ) {
          console.log("second");
          loadMoreItems();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );
    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasNextPage, loading, initialLoading, loadMoreItems]);

  if (initialLoading) {
    return (
      <div className="feed-loading">
        <p> Loading your feed...</p>
      </div>
    );
  }

  if (error) {
    return <p> oh no... </p>;
  }

  return (
    <div className="feed-container">
      <h1>Your Feed</h1>
      {feedItems.length === 0 ? (
        <div className="empty-feed">
          <p>No posts yet. </p>
        </div>
      ) : (
        <div className="feed-items">
          {feedItems.map((item, index) => (
            <FeedItem key={index} FeedItem={item}></FeedItem>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div ref={sentinelRef} className="scroll-sentinel">
          {loading && <p>Loading more posts...</p>}
        </div>
      )}
    </div>
  );
}

export default Feed;
