import React from "react";
import "./SearchBar.css";

function SearchBar({value, onChange, onSearch}) {
  const handleKeyDown = (e) => {
    if (e.key == "Enter") onSearch(value);
  };
  return (
    <div className="search-bar">
      <input
        id="search"
        type="text"
        placeholder="Search movies or shows..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default SearchBar;
