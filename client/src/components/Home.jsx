import React, {useState} from "react";
import Sidebar from "./Sidebar";
import MovieGrid from "./MovieGrid";
import "./Home.css";

const Home = () => {
  const [activeIcon, setActiveIcon] = useState("tv-shows");

  return (
    <div className="home-container">
      <Sidebar activeIcon={activeIcon} onActiveIconChange={setActiveIcon} />
      <div className="feed">
        <MovieGrid />
      </div>
    </div>
  );
};

export default Home;
