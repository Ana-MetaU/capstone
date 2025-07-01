import "./MovieCard.css";
function MovieCard({props}) {
  return (
    <div className="movie-card">
      {/* poster pic */}
      <img
        className="poster"
        src={
          props.poster_path
            ? "https://image.tmdb.org/t/p/w500" + `${props.poster_path}`
            : "/image.png"
        }
        alt={props.title}
      />

      <div className="movie-actions">
        <h3 className="movie-title">{props.title}</h3>
        <div className="movie-buttons">
          <button className="action-button watch-button">👀</button>
          <button className="action-button favorite-button">❤️</button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
