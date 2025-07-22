import {createContext, useContext, useState} from "react";
import {getFeed} from "../api/FeedApi";
import {addLike, removeLike} from "../api/FeedApi";
const FeedContext = createContext();

export const FeedProvider = ({children}) => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchInitialFeed = async () => {
    setInitialLoading(true);
    setError(null);

    try {
      const result = await getFeed();

      if (result.success) {
        setFeedItems(result.feed);
        setCurrentPage(1);
        setHasNextPage(result.pagination.hasNextPage);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.log("error fetching feed", error);
      setError("failed to load the feed");
    } finally {
      setInitialLoading(false);
    }
  };
  const loadMoreItems = async () => {
    if (!hasNextPage) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nextPage = currentPage + 1;
      const result = await getFeed(nextPage, 15);

      if (result.success) {
        setFeedItems((prev) => [...prev, ...result.feed]); //BUG FIXED: I was not spreading each individual feeditem f
        setCurrentPage(nextPage);
        setHasNextPage(result.pagination.hasNextPage);
        console.log("so once we get to second", result.feed);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.log("error loading more items", error);
      setError("error loading more items");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (watchedId, isCurrentlyLiked) => {
    console.log("omg is this working");
    setFeedItems((prevItems) =>
      prevItems.map((item) => {
        if (item.watchedId === watchedId) {
          return {
            ...item,
            interactions: {
              ...item.interactions,
              userLiked: !isCurrentlyLiked,
              likesCount: isCurrentlyLiked
                ? item.interactions.likesCount - 1
                : item.interactions.likesCount + 1,
            },
          };
        }
        return item;
      })
    );

    try {
      let result;
      if (isCurrentlyLiked) {
        result = await removeLike(watchedId);
      } else {
        result = await addLike(watchedId);
      }

      if (!result.success) {
        setFeedItems((prevItems) =>
          prevItems.map((item) => {
            if (item.watchedId === watchedId) {
              return {
                ...item,
                interactions: {
                  ...item.interactions,
                  userLiked: isCurrentlyLiked,
                  likesCount: isCurrentlyLiked
                    ? item.interactions.likesCount + 1
                    : item.interactions.likesCount - 1,
                },
              };
            }
            return item;
          })
        );
        setError(result.message || "Failed to update like");
      }
    } catch (error) {
      console.log("Error toggling like:", error);

      // Revert optimistic update on error
      setFeedItems((prevItems) =>
        prevItems.map((item) => {
          if (item.watchedId === watchedId) {
            return {
              ...item,
              interactions: {
                ...item.interactions,
                userLiked: isCurrentlyLiked,
                likesCount: isCurrentlyLiked
                  ? item.interactions.likesCount + 1
                  : item.interactions.likesCount - 1,
              },
            };
          }
          return item;
        })
      );
      setError("Failed to update like");
    }
  };

  const value = {
    feedItems,
    loading,
    toggleLike,
    error,
    initialLoading,
    hasNextPage,
    currentPage,
    fetchInitialFeed,
    loadMoreItems,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};
export const useFeed = () => useContext(FeedContext);
