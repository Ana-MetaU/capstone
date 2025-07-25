import React, {useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {searchUsersByUsername} from "../../api/UsersApi";
import {useUser} from "../../context/UserContext";
import UserSearchItem from "./UserSearchItem";
import "./SearchResults.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const {user} = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q") || "";

    setSearchQuery(query);
    if (query) {
      searchUsers(query);
    }
  }, [searchParams]);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      console.log("searching for users", query);
      const result = await searchUsersByUsername(query);
      console.log("result", result);
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

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <h2> Search Results: </h2>
        {searchQuery && (
          <p className="search-query"> Results for {searchQuery}</p>
        )}
      </div>

      <div className="search-results-content">
        {isLoading ? (
          <div className="loading-state">
            <p> searching for users...</p>
          </div>
        ) : (
          <div>
            {userResults.length > 0 ? (
              <div className="user-list">
                {userResults.map((searchUser) => (
                  <UserSearchItem
                    key={searchUser.userId}
                    user={searchUser}
                    currentUser={user}
                  ></UserSearchItem>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p> no search results... </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchResults;
