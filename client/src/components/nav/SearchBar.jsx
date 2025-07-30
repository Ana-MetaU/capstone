import {useEffect, useState} from "react";
import {SearchButton} from "../UI/Buttons";
import "./SearchBar.css";

function SearchBar({value, onChange, onSearch}) {

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      if (value.trim()) {
        onSearch(value);
      }
    }
  };

  const handleSearchClick = () => {
    if (value.trim()) {
      onSearch();
    }
  };
  return (
    <>
      <div className="search-bar-container">
        <div className={`search-bar`}>
            <input
              className="search-input"
              id="search"
              type="text"
              placeholder="Search..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          <button
            className="search-button"
            onClick={handleSearchClick}
            type="button"
          >
            <SearchButton></SearchButton>
          </button>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
