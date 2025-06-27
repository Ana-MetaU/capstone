import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import "./Graphic.css"
import "./LogIn.css";

const Graphic = () => {
  return (
    <div className="movie-banners">
      <div className="banner-container">
        <img
        src="/Graphic.png"
        alt= "Graphic movie banners"
        className="movie-poster"
        />
      </div>
    </div>
  );
};

export default Graphic;
