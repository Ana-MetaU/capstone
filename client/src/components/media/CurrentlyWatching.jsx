import "./CurrentlyWatching.css";

// TODO: have to edit to use the api
function CurrentlyWatching({movies}) {
  const CurrentMovies = () => {
    if (!movies) {
      return <p>No current movies. </p>;
    }
    return movies.map((movie) => (
      <div key={movie.id} className="movie-container">
        <img
          src={
            movie.poster_path
              ? "https://image.tmdb.org/t/p/w500" + `${movie.poster_path}`
              : "/Graphic.png"
          }
          alt={movie.title}
          className="poster-image"
        />
      </div>
    ));
  };
  return (
    <div className="currently-watching">
      <h2 className="section-title"> Currently Watching</h2>
      <div className="currently-movie-grid">{CurrentMovies()}</div>
    </div>
  );
}

export default CurrentlyWatching;
