import React from "react";
import './SearchBar.css'

function SearchBar({value, onChange}) {
  return (
    <div className="search-bar">
      <input
        id="search"
        type="text"
        placeholder="Search movies or shows..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}


export default SearchBar;