import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchBar from "./SearchBar";
import {useUser} from "../../context/UserContext";
import "./Sidebar.css";
import {
  HomeButton,
  MoviesButton,
  ProfileButton,
  ShowsButton,
  SettingsButton,
} from "../UI/Buttons";

const Sidebar = ({activeIcon, onActiveIconChange}) => {
  const {user} = useUser();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = () => {
    console.log("searching for ", searchValue);
  };
  const items = [
    {id: "home", icon: <HomeButton />, label: "Home"},
    {id: "tv-shows", icon: <ShowsButton />, label: "TV Show"},
    {id: "movies", icon: <MoviesButton />, label: "Movies"},
    {id: "settings", icon: <SettingsButton />, label: "Settings"},
    {id: "profile", icon: <ProfileButton />, label: "Profile"},
  ];

  const handleIconClick = (itemId) => {
    console.log("here", itemId);
    if (itemId === "profile") {
      onActiveIconChange(itemId);
      navigate(`/${user.username}`);
    } else if (itemId === "settings") {
      onActiveIconChange(itemId);
      navigate("/settings");
    } else {
      onActiveIconChange(itemId);
      navigate("/");
    }
  };

  const renderItems = () => {
    console.log("actuve icon", activeIcon);
    return items.map((item) => (
      <button
        key={item.id}
        className={`sidebar-item ${activeIcon === item.id ? "active" : ""}`}
        onClick={() => handleIconClick(item.id)}
        type="button"
      >
        <div className="sidebar-icon">{item.icon}</div>
        <span className="sidebar-label">{item.label}</span>
      </button>
    ));
  };

  return (
    <div className="sidebar">
      <aside>
        <div className="sidebar-header">
          <h3>PARTY WATCH</h3>
        </div>

        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSearch={handleSearch}
        ></SearchBar>

        <div className="sidebar-items">{renderItems()}</div>
      </aside>
    </div>
  );
};

export default Sidebar;
