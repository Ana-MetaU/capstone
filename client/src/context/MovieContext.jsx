import {createContext, useEffect, useState} from "react";

const MovieContext = createContext();

// Provider Component
function MovieProvider({children}) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  // Fetch movies from TMDB API conditionally (for all movies and search results)
  const fetchMovies = async () => {
    var url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
    var options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_BEARER}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log("result", result.results);
      const newMovies = result.results;
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
    } catch (error) {
      console.error(
        "*************Error fetching movies****************",
        error
      );
    }
  };

  // Fetch movies on page change
  useEffect(() => {
    fetchMovies();
  }, [page]);

  return (
    <MovieContext.Provider
      value={{
        movies: movies,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
export {MovieContext, MovieProvider};
