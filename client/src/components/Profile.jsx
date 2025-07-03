import {useUser} from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import WithAuth from "./WithAuth";
import "./Profile.css";

const Profile = () => {
  const {user} = useUser();
  console.log("user", user);
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-picture">
            <img src="/image.png"></img>
          </div>

          <div className="profile-details">
            <h2> {user ? user.username : " "}</h2>
            <p>this is my bio. </p>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat">
            <span className="stats-label">Movies Watched</span>
            <span className="stats-number">403</span>
          </div>

          <div className="stat">
            <span className="stats-label">TV Shows Watched</span>
            <span className="stats-number">50</span>
          </div>

          <div className="stat">
            <span className="stats-label">Followers</span>
            <span className="stats-number">23</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(Profile);
