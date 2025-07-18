import {useState} from "react";
import WatchedGrid from "./WatchedGrid";
import FavoritesGrid from "./FavoritesGrid";
import WantToWatchGrid from "./WantToWatchGrid";
import "../../media/MovieTabs.css";
const MovieTabs = ({userId}) => {
  const [activeTab, setActiveTab] = useState("watched");

  const renderTabContent = () => {
    if (activeTab === "watched") {
      return <WatchedGrid userId={userId}></WatchedGrid>;
    } else if (activeTab === "favorites") {
      return <FavoritesGrid userId={userId}></FavoritesGrid>;
    } else if (activeTab === "wantToWatch") {
      return <WantToWatchGrid userId= {userId}></WantToWatchGrid>;
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
