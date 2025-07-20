import {useContext} from "react";
import {MovieContext} from "../../context/MovieContext";

function Trailer() {
  const {movieVideos} = useContext(MovieContext);

  if (!movieVideos || movieVideos.length === 0) {
    return <p>No trailer available.</p>;
  }

  // Use the first trailer's video key
  const trailer = movieVideos[0];
  const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`;

  return (
    <div className="trailer-container">
      <iframe
        width="100%"
        height="500"
        src={youtubeUrl}
        title={trailer.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default Trailer;
