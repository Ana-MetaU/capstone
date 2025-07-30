import {useState} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import {MovieProvider} from "../../context/MovieContext.jsx";
import {TVShowProvider} from "../../context/TvShowContext.jsx";
import Feed from "../feed/Feed.jsx";
import WithAuth from "../auth/WithAuth.jsx";
import Settings from "../Settings/Settings";
import Profile from "../profile/Profile";
import Sidebar from "../nav/Sidebar.jsx";
import MovieRowsPage from "../media/MovieRowsPage.jsx";
import TvShowRowsPage from "../media/TvShowRowsPage.jsx";
import SearchResults from "../profile/SearchResults.jsx";
import UserProfile from "../profile/UserProfile.jsx";
import Notifications from "../profile/Notifications.jsx";
import SearchBar from "../nav/SearchBar.jsx";
import "./Layout.css";

function Layout() {
  const [activeIcon, setActiveIcon] = useState(null);
  const [isCollapsed, setIsCollapased] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const renderPages = () => {
    switch (activeIcon) {
      case "tv-shows":
        return <TvShowRowsPage></TvShowRowsPage>;
      case "movies":
        return <MovieRowsPage></MovieRowsPage>;
      case "notification":
        return <Notifications></Notifications>;
      default:
        return <Feed></Feed>;
    }
  };

  return (
    <div className={`layout ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar
        activeIcon={activeIcon}
        onActiveIconChange={setActiveIcon}
        isCollapsed={isCollapsed}
        setIsCollapased={setIsCollapased}
      />
      <div className="main-content">
        <TVShowProvider>
          <MovieProvider>
            <Routes>
              <Route path="/" element={renderPages()} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/profile/:username" element={<UserProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/:username" element={<Profile />} />
            </Routes>
          </MovieProvider>
        </TVShowProvider>
      </div>
    </div>
  );
}

export default WithAuth(Layout);
