import {createContext, useEffect, useState} from "react";
import {
  removeWantToWatchTVShow,
  addFavoriteTVShow,
  removeFavoriteTVShow,
  addWantToWatchTVShow,
  getFavoriteTVShows,
  getWantToWatchTVShows,
} from "../api/TVShowApi";

import {getAllTVShowRows} from "../api/MediaApiV2";

const TVShowContext = createContext();

function TVShowProvider({children}) {
  const [showsRows, setShowsRows] = useState({
    currentlyAiring: [],
    todaysGenre: [],
    randomShows: [],
  });
  const [showDetail, setShowDetail] = useState([]);
  const [selectedTVShow, setSelectedTVShow] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [wantToWatchShows, setWantToWatchShows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from API
  const loadFavorites = async () => {
    try {
      const result = await getFavoriteTVShows();
      if (result.success && result.shows) {
        setFavorites(result.shows);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Load want to watch TV shows from API
  const loadWantToWatchShows = async () => {
    try {
      const result = await getWantToWatchTVShows();
      if (result.success && result.shows) {
        setWantToWatchShows(result.shows);
      }
    } catch (error) {
      console.error("Error loading want to watch TV shows:", error);
    }
  };

  // Add isFavorite and isWantToWatch booleans to the show objects
  const addFlagsToShows = (shows) => {
    return shows.map((show) => ({
      ...show,
      isFavorite: favorites.filter((fav) => fav.tvdbId === show.id).length > 0,
      isWantToWatch:
        wantToWatchShows.filter((want) => want.tvdbId === show.id).length > 0,
    }));
  };

  const getShowsRowsWithFlags = () => {
    return {
      currentlyAiring: addFlagsToShows(showsRows.currentlyAiring),
      todaysGenre: addFlagsToShows(showsRows.todaysGenre),
      randomShows: addFlagsToShows(showsRows.randomShows),
    };
  };

  // Fetch TV shows from TVDB API
  const fetchTVShows = async () => {
    setLoading(true);
    try {
      const result = await getAllTVShowRows();
      if (result.success) {
        setShowsRows({
          currentlyAiring: result.currentlyAiring,
          todaysGenre: result.todaysGenre,
          randomShows: result.randomShows,
        });
      }
    } catch (error) {
      console.error("Error fetching TV shows", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (show) => {
    try {
      const showId = show.id;
      const isFavorited =
        favorites.filter((fav) => fav.tvdbId === showId).length > 0;

      if (isFavorited) {
        await removeFavoriteTVShow(showId);
      } else {
        const showData = {
          tvdbId: showId,
          posterPath: show.image,
        };
        await addFavoriteTVShow(showData);
      }

      // Reload favorites after toggling
      await loadFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Toggle want to watch
  const toggleWantToWatch = async (show) => {
    try {
      const showId = show.id;
      const isWantToWatch =
        wantToWatchShows.filter((want) => want.tvdbId === showId).length > 0;

      if (isWantToWatch) {
        await removeWantToWatchTVShow(showId);
      } else {
        const showData = {
          tvdbId: showId,
          posterPath: show.image,
        };
        await addWantToWatchTVShow(showData);
      }

      // Reload want to watch list after toggling
      await loadWantToWatchShows();
    } catch (error) {
      console.error("Error toggling want to watch:", error);
    }
  };

  // Open and close modal
  function openModal(show) {
    setSelectedTVShow(show);
  }
  function closeModal() {
    setSelectedTVShow(null);
  }

  useEffect(() => {
    loadFavorites();
    loadWantToWatchShows();
    fetchTVShows();
  }, []);

  return (
    <TVShowContext.Provider
      value={{
        shows: getShowsRowsWithFlags(),
        selectedTVShow,
        setSelectedTVShow,
        showDetail,
        openModal,
        closeModal,
        toggleFavorite,
        toggleWantToWatch,
        loading,
      }}
    >
      {children}
    </TVShowContext.Provider>
  );
}

export {TVShowContext, TVShowProvider};
