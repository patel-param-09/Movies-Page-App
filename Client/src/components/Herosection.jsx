import React from "react";
import { Link } from "react-router-dom";

function Herosection({ title, src, rating, url }) {
  return (
    <div className="main-container">
      <div className="Card">
        <Link
          to={`/${title.split(" ").join("-")}`}
          className="Click"
          state={{ rating, url }}
        >
          <img src={src} alt="" />
        </Link>
        <div className="bottom-icon">
          <h3 className="movie-name">{title}</h3>
          <button className="plus-button">+</button>
        </div>
      </div>
    </div>
  );
}

export default Herosection;
