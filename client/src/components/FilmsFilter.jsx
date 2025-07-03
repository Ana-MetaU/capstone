import React from "react";
import "./FilmsFilter.css";

const categories = ["Watched", "Favorites"];

const FilmsFilter = ({selectedCategory, onSelect}) => {
  return (
    <div className="films-filter">
      <div className="films-filter-scroll">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilmsFilter;
