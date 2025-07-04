import {useState} from "react";
import {MovieProvider} from "../../context/MovieContext.jsx";
import {Routes, Route} from "react-router-dom";
import Feed from "../feed/Feed.jsx";
import WithAuth from "../auth/WithAuth.jsx";
import Settings from "../Settings/Settings";
import Profile from "../profile/Profile";
import Sidebar from "../nav/Sidebar.jsx";
import MovieGrid from "../media/MovieGrid.jsx";
import "/src/App.css";
function Layout() {
  const [activeIcon, setActiveIcon] = useState(null);
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
