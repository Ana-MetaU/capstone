import React, {act, useState, useEffect} from "react";
import {MovieProvider} from "../context/MovieContext.jsx";
import {Routes, Route, useLocation} from "react-router-dom";
import Feed from "./Feed.jsx";
import WithAuth from "./WithAuth.jsx";
import Settings from "./Settings.jsx";
import Profile from "./Profile.jsx";
import Sidebar from "./Sidebar.jsx";
import MovieGrid from "./MovieGrid.jsx";
import "../App.css";
function Layout() {
  const [activeIcon, setActiveIcon] = useState(null);
  const location = useLocation();
  console.log("active icon in parent", activeIcon);

  const renderPages = () => {
    switch (activeIcon) {
      case "tv-shows":
        return <MovieGrid></MovieGrid>;
      case "movies":
        return <MovieGrid></MovieGrid>;
      default:
        return <Feed></Feed>;
    }
  };

  return (
    <div className="layout">
      <Sidebar activeIcon={activeIcon} onActiveIconChange={setActiveIcon} />
      <div className="main-content">
        <MovieProvider>
          <Routes>
            <Route path="/" element={renderPages()} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/:username" element={<Profile />} />
          </Routes>
        </MovieProvider>
      </div>
    </div>
  );
}

export default WithAuth(Layout);
