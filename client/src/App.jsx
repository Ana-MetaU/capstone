import React, {useState} from "react";
import {MovieProvider} from "./context/MovieContext.jsx";
import {Routes, Route} from "react-router-dom";
import LogIn from "./components/LogIn";
import Profile from "./components/Profile.jsx";
import SignUp from "./components/SignUp";
import Sidebar from "./components/Sidebar.jsx";
import MovieGrid from "./components/MovieGrid.jsx";
import "./App.css";
function App() {
  const [activeIcon, setActiveIcon] = useState("tv-shows");

  const renderPages = () => {
    switch (activeIcon) {
      case "tv-shows":
        return <MovieGrid></MovieGrid>;
      case "movies":
        return <MovieGrid></MovieGrid>;
      case "profile":
        return <Profile></Profile>;
    }
  };

  return (
    <div className="layout">
      <Sidebar activeIcon={activeIcon} onActiveIconChange={setActiveIcon} />
      <div className="main-content">
        <MovieProvider>
          <Routes>
            <Route path="/" element={renderPages()} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
          </Routes>
        </MovieProvider>
      </div>
    </div>
  );
}

export default App;
