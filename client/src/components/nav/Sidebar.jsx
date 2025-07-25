import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchBar from "./SearchBar";
import {userLogout} from "../../api/UserApi";
import {useUser} from "../../context/UserContext";
import "./Sidebar.css";
import {
  HomeButton,
  MoviesButton,
  ProfileButton,
  ShowsButton,
  SettingsButton,
  NotificationButton,
  LogoutButton,
} from "../UI/Buttons";

const Sidebar = ({activeIcon, onActiveIconChange}) => {
  const {user, setUser} = useUser();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const handleLogout = async () => {
    try {
      const result = await userLogout();
      if (result.success) {
        setUser(null);
        window.location.replace("/");
      } else {
        console.log("log out failed", result);
      }
    } catch (error) {
      console.log("logout error", error);
    }
  };
  const handleSearch = () => {
    console.log("searching for ", searchValue);

    if (searchValue.trim()) {
      navigate(`/search?q=${searchValue}`);
    }
  };
  const items = [
    {id: "home", icon: <HomeButton />, label: "Home"},
    {id: "tv-shows", icon: <ShowsButton />, label: "TV Show"},
    {id: "movies", icon: <MoviesButton />, label: "Movies"},
    {id: "notification", icon: <NotificationButton />, label: "Notifications"},
    {id: "settings", icon: <SettingsButton />, label: "Settings"},
    {id: "profile", icon: <ProfileButton />, label: "Profile"},
  ];

  const handleIconClick = (itemId) => {
    if (itemId === "profile") {
      onActiveIconChange(itemId);
      navigate(`/${user.username}`);
    } else if (itemId === "settings") {
      onActiveIconChange(itemId);
      navigate("/settings");
    } else {
      onActiveIconChange(itemId);
      console.log("itemid", itemId);
      navigate("/");
    }
  };

  const renderItems = () => {
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

        <div className="logout-button">
          <button onClick={handleLogout}>
            <LogoutButton></LogoutButton>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
