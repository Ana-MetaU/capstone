import {useEffect, useRef, useState} from "react";
import FeedItem from "./FeedItem";
import {useFeed} from "../../context/FeedContext";
import FriendsFilter from "./FriendsFilter";
import "./Feed.css";
function Feed() {
  const [showFilters, setShowFilters] = useState(false);
  const {
    feedItems,
    filteredFeedItems,
    initialLoading,
    loading,
    error,
    hasNextPage,
    fetchInitialFeed,
    loadMoreItems,
  } = useFeed();
  console.log("feedItems", feedItems);
  console.log("filtered", filteredFeedItems);
  console.log("feed items length", feedItems.length);
  console.log("filtered items lenght", filteredFeedItems?.length);
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
      <div className="feed-header">
        <h1>Your Feed</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle"
        >
          Show Filters{" "}
        </button>
      </div>
      <div className="feed-filter">
        {showFilters && <FriendsFilter></FriendsFilter>}
      </div>
      <div className="feed-container-inner">
        {filteredFeedItems.length === 0 ? (
          <div className="empty-feed">
            <p>No posts yet. </p>
          </div>
        ) : (
          <div className="feed-items">
            {filteredFeedItems.map((item, index) => (
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
    </div>
  );
}

export default Feed;
