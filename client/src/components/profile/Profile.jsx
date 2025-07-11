import {useUser} from "../../context/UserContext";
import {useState, useContext} from "react";
import WithAuth from "../auth/WithAuth";
import CurrentlyWatching from "../media/CurrentlyWatching";
import {EditButton} from "../UI/Buttons";
import EditProfileModal from "./EditProfileModal";
import MovieTabs from "../media/MovieTabs";
import {MovieContext} from "../../context/MovieContext";
import {useProfile} from "../../context/ProfileContext";
import "./Profile.css";

// TODO: replace currently wathcing with recently watched. fetch latest 16 movies watched.
const Profile = () => {
  const {user} = useUser();
  const {profile, fetchProfile} = useProfile();
  const {movies} = useContext(MovieContext);
  const [isEditmodalOpen, setIsEditModalOpen] = useState(false);

  const handleProfileUpdate = () => {
    fetchProfile();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button
          className="edit-profile-button"
          onClick={() => setIsEditModalOpen(true)}
        >
          <EditButton></EditButton>
        </button>
        <div className="profile-info">
          <div className="profile-picture">
            <img
              src={
                profile && profile.profilePicture
                  ? profile.profilePicture
                  : "/image.png"
              }
              alt="avatar"
            ></img>
          </div>

          <div className="profile-details">
            <h2> {user ? user.username : " "}</h2>
            <p>{profile?.bio || ""}</p>
            <div className="favorite-genres">
              <span className="genres-label">
                {profile
                  ? `Favorite Genres: ${profile.favoriteGenres.join(", ")}`
                  : " "}
              </span>
            </div>
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
      <CurrentlyWatching movies={movies} />
      <MovieTabs></MovieTabs>

      {isEditmodalOpen && (
        <EditProfileModal
          isOpen={isEditmodalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProfile={profile}
          userId={user?.id}
          onProfileUpdate={handleProfileUpdate}
        ></EditProfileModal>
      )}
    </div>
  );
};

export default WithAuth(Profile);
