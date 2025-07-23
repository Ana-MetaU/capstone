import {useFeed} from "../../context/FeedContext";
import "./FriendsFilter.css";
const FriendsFilter = () => {
  const {selectedFriends, Friends, updateSelectedFriends, clearFilters} =
    useFeed();

  return (
    <div className="friends-filter">
      <div className="filter-header">
        <h2> Filters </h2>
      </div>
      <div className="filter-actions">
        <button className="clear-button" onClick={clearFilters}>
          {" "}
          Show all
        </button>
      </div>

      <div className="friends-list">
        {Friends.length === 0 ? (
          <p>no friends to filter by</p>
        ) : (
          Friends.map((friend) => (
            <label key={friend.id} className="friend-checkbox">
              <input
                type="checkbox"
                checked={selectedFriends.has(friend.id)}
                onChange={() => updateSelectedFriends(friend.id)}
              />
              <div className="friend-info">
                <img
                  className="friend-avatar"
                  src={
                    friend.profilePicture ? friend.profilePicture : "/image.png"
                  }
                  alt={`${friend.username} avatar`}
                ></img>
                <span className="friend-name"> {friend.username}</span>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
};
export default FriendsFilter;
