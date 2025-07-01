import React, {useState} from "react";
import SearchBar from "./Searchbar";
import "./Sidebar.css";

const Sidebar = ({activeIcon, onActiveIconChange}) => {
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = () => {
    console.log("searching for ", searchValue);
  };
  const items = [
    {id: "tv-shows", icon: "💻", label: "TV Show"},
    {id: "movies", icon: "🍿", label: "Movies"},
    {id: "settings", icon: "🌐", label: "Settings"},
    {id: "profile", icon: "👩", label: "Profile"},
  ];

  const renderItems = () => {
    return items.map((item) => (
      <button
        key={item.id}
        className={`sidebar-item ${activeIcon === item.id ? "active" : ""}`}
        onClick={() => onActiveIconChange(item.id)}
        type="button"
      >
        <span className="sidebar-icon">{item.icon}</span>
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
