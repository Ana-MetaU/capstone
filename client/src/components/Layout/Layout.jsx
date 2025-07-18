import {useState} from "react";
import {Routes, Route} from "react-router-dom";
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
import "./Layout.css";

function Layout() {
  const [activeIcon, setActiveIcon] = useState(null);
  const renderPages = () => {
    switch (activeIcon) {
      case "tv-shows":
        return <TvShowRowsPage></TvShowRowsPage>;
      case "movies":
        return <MovieRowsPage></MovieRowsPage>;
      default:
        return <Feed></Feed>;
    }
  };

  return (
    <div className="layout">
      <Sidebar activeIcon={activeIcon} onActiveIconChange={setActiveIcon} />
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
