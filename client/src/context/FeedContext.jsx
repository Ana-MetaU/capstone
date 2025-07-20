import {createContext, useContext, useState} from "react";
import {getFeed} from "../api/FeedApi";
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
        setFeedItems((prev) => [...prev, result.feed]);
        setCurrentPage(nextPage);
        setHasNextPage(result.pagination.hasNextPage);
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

  const value = {
    feedItems,
    loading,
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
