import React, {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {searchUsersByUsername} from "../../api/UsersApi";
import {useUser} from "../../context/UserContext";
import UserSearchItem from "./UserSearchItem";
import {searchMovies, searchShows} from "../../api/MediaApi";
import "./SearchResults.css";
import {useContext} from "react";
import {MovieContext} from "../../context/MovieContext";
import MovieCard from "../media/MovieCard";
import MovieDetails from "../media/MovieDetails";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const {user} = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [mediaResults, setMediaResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("profiles");
  const {setSelectedMovie, openModal, addFlagsToMovies} =
    useContext(MovieContext);
  useEffect(() => {
    const query = searchParams.get("q") || "";

    setSearchQuery(query);
    if (query) {
      if (searchType === "profiles") {
        searchUsers(query);
      } else {
        searchMedia(query);
      }
    }
  }, [searchParams, searchType]);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      const result = await searchUsersByUsername(query);
      if (result.success) {
        setUserResults(result.results || []);
      } else {
        console.log("searching for users failed", result.message);
        setUserResults([]);
      }
    } catch (error) {
      console.log("search error", error);
      setUserResults([]);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const searchMedia = async (query) => {
    if (!query.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      const [movieResponse, showResponse] = await Promise.all([
        searchMovies(query),
        searchShows(query),
      ]);

      const movies = movieResponse.success ? movieResponse.results : [];
      const shows = showResponse.success ? showResponse.results : [];

      const movieResults = addFlagsToMovies(movies);

      const showResults = addFlagsToMovies(
        shows.map((show) => ({
          ...show,
          title: show.name,
          release_date: show.first_air_date,
        }))
      );

      const combined = [...movieResults, ...showResults];
      setMediaResults(combined);
    } catch (error) {
      console.log("failed to search media", error);
      setMediaResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const renderMediaItem = (item) => {
    return (
      <MovieCard
        key={item.id}
        props={item}
        onClick={() => handleMovieClick(item)}
        showAction={true}
      ></MovieCard>
    );
  };

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <h2> Search Results: </h2>
        {searchQuery && (
          <p className="search-query"> Results for {searchQuery}</p>
        )}

        <div className="search-toggle">
          <button
            onClick={() => setSearchType("profiles")}
            className={`toggle-button ${
              searchType === "profiles" ? "active" : ""
            }`}
          >
            Profiles
          </button>
          <button
            onClick={() => setSearchType("media")}
            className={`toggle-button ${
              searchType === "media" ? "active" : ""
            }`}
          >
            Media
          </button>
        </div>
      </div>

      <div className="search-results-content">
        {isLoading ? (
          <div className="loading-state">
            <p> searching for {searchType}</p>
          </div>
        ) : (
          <div>
            {searchType === "profiles" ? (
              userResults.length > 0 ? (
                <div className="user-list">
                  {userResults.map((searchUser) => (
                    <UserSearchItem
                      key={searchUser.userId}
                      user={searchUser}
                      currentUser={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p> no search results... </p>
                </div>
              )
            ) : mediaResults.length === 0 ? (
              <div className="empty">
                <p> No media results</p>
              </div>
            ) : (
              <div className="movie-grid">
                {addFlagsToMovies(mediaResults).map((item) =>
                  renderMediaItem(item)
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <MovieDetails></MovieDetails>
    </div>
  );
};
export default SearchResults;
