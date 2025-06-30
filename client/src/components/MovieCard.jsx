import './MovieCard.css'
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
    </div>
  );
}

export default MovieCard;
