import {useState} from "react";
import WatchedMoviesGrid from "./WatchedMoviesGrid";
import "./MovieTabs.css";
import FavoritesGrid from "./FavoritesGrid";
import WantToWatchGrid from "./WantToWatchGrid";

const MovieTabs = () => {
  const [activeTab, setActiveTab] = useState("watched");

  const renderTabContent = () => {
    if (activeTab === "watched") {
      return <WatchedMoviesGrid></WatchedMoviesGrid>;
    } else if (activeTab === "favorites") {
      return <FavoritesGrid></FavoritesGrid>;
    } else if (activeTab === "wantToWatch") {
      return <WantToWatchGrid></WantToWatchGrid>;
    }
  };
  return (
    <div className="tabs-section">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "watched" ? "active" : ""}`}
          onClick={() => setActiveTab("watched")}
        >
          Watched
        </button>
        <button
          className={`tab ${activeTab === "wantToWatch" ? "active" : ""}`}
          onClick={() => setActiveTab("wantToWatch")}
        >
          Want to Watch
        </button>
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites
        </button>
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default MovieTabs;
