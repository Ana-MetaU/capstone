import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "./UserSearchItem.css";
const UserSearchItem = ({user, currentUser}) => {
  const navigate = useNavigate();

  if (currentUser && user.userId === currentUser.id) {
    return null;
  }

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className="user-search-item" onClick={handleProfileClick}>
      <div className="avatar">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt={user.username} />
        ) : (
          <img className="not found" src="/image.png" alt={user.username} />
        )}
      </div>

      <div className="user-info">
        <div className="username">{user.username}</div>
      </div>
    </div>
  );
};

export default UserSearchItem;
