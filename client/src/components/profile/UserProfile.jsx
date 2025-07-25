import {useEffect, useState} from "react";
import {
  followUser,
  unfollowUser,
  getFollowStatus,
  acceptFollowRequest,
  rejectFollowRequet,
  checkFriendOfFriendsAcess,
  cancelFollowRequest,
} from "../../api/FollowApi";
import {useParams} from "react-router-dom";
import {useUser} from "../../context/UserContext";
import {LockButton} from "../UI/Buttons";
import "./UserProfile.css";
import {getUserProfileByUsername, getUserStats} from "../../api/UsersApi";
import MovieTabs from "./ProfileMedia/MovieTabs";
const UserProfile = () => {
  const {username} = useParams(); //username of the clicked user
  const {user} = useUser();
  const [UserProfile, setUserProfile] = useState(null);
  const [followStatus, setFollowStatus] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [userStats, setUserStats] = useState({});
  const [canView, setCanView] = useState(false);
  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);
  useEffect(() => {
    canViewContent();
  }, [UserProfile?.userId, followStatus]);

  useEffect(() => {
    checkFollowStatus();
    fetchUserStats();
  }, [UserProfile?.userId]);

  const fetchUserStats = async () => {
    if (UserProfile?.userId) {
      const result = await getUserStats(UserProfile.userId);
      if (result.success) {
        setUserStats({
          moviesWatched: result.stats.movieCount,
          tvShowsWatched: result.stats.TvShowCount,
          followers: result.stats.Followers,
          following: result.stats.Following,
        });
      }
    }
  };
  const fetchUserProfile = async () => {
    try {
      const result = await getUserProfileByUsername(username);
      if (result.success) {
        setUserProfile(result.profile);
      } else {
        setUserProfile(null);
      }

      setIsLoading(false);
    } catch (error) {
      console.log("error fetchign user profile", error);
      setIsLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!UserProfile?.userId) {
      return;
    }
    try {
      const result = await getFollowStatus(UserProfile.userId);
      if (result.success) {
        setFollowStatus(result.status);
      } else {
        console.log("failed to check follow status", result.message);
      }
    } catch (error) {
      console.log("error checking follow status", error);
    }
  };

  const handleFollowClick = async () => {
    setFollowLoading(true);

    try {
      if (followStatus === "none") {
        console.log("calling followerUser for ", UserProfile.userId);
        const result = await followUser(UserProfile.userId);
        if (result.success) {
          await checkFollowStatus();
          await canViewContent();
        } else {
          console.log("follow failed", result.message);
        }
      } else if (followStatus === "following") {
        console.log("calling unfollowUser for userId", UserProfile.userId);
        const result = await unfollowUser(UserProfile.userId);

        if (result.success) {
          await checkFollowStatus();
          await canViewContent();
        } else {
          console.log("unfollow failed", result.message);
        }
      } else if (followStatus === "request sent") {
        const result = await cancelFollowRequest(UserProfile.userId);
        console.log("result of cancel", result);
        if (result.success) {
          await checkFollowStatus();
          await canViewContent();
        } else {
          console.log("cancling request erorr", result.message);
        }
      }
    } catch (error) {
      console.log("error following user", error);
      setFollowLoading(false);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setFollowLoading(true);

    try {
      console.log("accepting follow request from ", UserProfile.username);
      const result = await acceptFollowRequest(UserProfile.userId);

      if (result.success) {
        await checkFollowStatus();
        await canViewContent();
      } else {
        console.log("accepted request failed", result.message);
      }
    } catch (error) {
      console.log("error accepting follow request", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeclineRequest = async () => {
    setFollowLoading(true);

    try {
      console.log("declining follow request from ", UserProfile.username);
      const result = await rejectFollowRequet(UserProfile.userId);

      if (result.success) {
        await checkFollowStatus();
        await canViewContent();
      } else {
        console.log("decline request failed", result.message);
      }
    } catch (error) {
      console.log("error declining follow request", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const canViewContent = async () => {
    if (!UserProfile) {
      return;
    }

    if (UserProfile.privacyLevel === "public") {
      setCanView(true);
      return;
    }

    if (followStatus === "following") {
      setCanView(true);
      return;
    }
    if (UserProfile.privacyLevel === "friends_of_friends") {
      try {
        const result = await checkFriendOfFriendsAcess(UserProfile.userId);
        setCanView(result.hasAccess);
        return;
      } catch (error) {
        console.log("error checking friend of friends access", error);
        setCanView(false);
        return;
      }
    }
    setCanView(false);
  };

  if (isLoading) {
    return (
      <div className="user-profile-container">
        <div className="loading-state">
          <p> Loading profile ...</p>
        </div>
      </div>
    );
  }

  if (!UserProfile) {
    return (
      <div className="user-profile-container">
        <div className="error">
          <h2> user not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      {followStatus === "request recieved" && user?.username !== username && (
        <div className="follow-request-notificaiton">
          <p>{UserProfile.username} sent you a follow request</p>
          <div className="accept-request">
            <button
              className="follow-button follow-button-primary"
              onClick={handleAcceptRequest}
            >
              {followLoading ? "Loading..." : "Accept"}
            </button>

            <button
              className="follow-button follow-button-secondary"
              onClick={handleDeclineRequest}
            >
              Decline
            </button>
          </div>
        </div>
      )}
      <div className="user-profile-header">
        {user?.username !== username && followStatus !== "request recieved" && (
          <div className="profile-actions">
            <button
              className={`follow-button  ${
                followStatus === "none"
                  ? "follow-button-primary"
                  : followStatus === "following" ||
                    followStatus === "request sent"
                  ? "follow-button-secondary"
                  : "follow-button-primary"
              }`}
              onClick={handleFollowClick}
            >
              {followLoading
                ? "Loading"
                : followStatus === "none"
                ? "Follow"
                : followStatus === "following"
                ? "Following"
                : followStatus === "request sent"
                ? "Request"
                : "Follow"}
            </button>
          </div>
        )}

        <div className="profile-info">
          <div className="profile-picture">
            <img
              src={UserProfile.profilePicture || "/image.png"}
              alt={`${UserProfile.username} avatar`}
            />
          </div>

          <div className="profile-details">
            <h2>{UserProfile.username}</h2>
            <p>{UserProfile.bio}</p>

            {UserProfile.favoriteGenres &&
              UserProfile.favoriteGenres.length > 0 && (
                <div className="favorite-genres">
                  <span className="genres-label">
                    {" "}
                    Favorite Genres: {UserProfile.favoriteGenres.join(", ")}
                  </span>
                </div>
              )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <span className="stats-label">Movies Watched</span>
            <span className="stats-number"> {userStats.moviesWatched}</span>
          </div>

          <div className="stat">
            <span className="stats-label">TV Shows Watched</span>
            <span className="stats-number">{userStats.tvShowsWatched}</span>
          </div>

          <div className="stat">
            <span className="stats-label"> Followers</span>
            <span className="stats-number">{userStats.followers || 0}</span>
          </div>

          <div className="stat">
            <span className="stats-label"> Following </span>
            <span className="stats-number">{userStats.following || 0}</span>
          </div>
        </div>
      </div>
      <div className="profile-content">
        {canView ? (
          <div className="public">
            <MovieTabs userId={UserProfile.userId}></MovieTabs>
          </div>
        ) : (
          <div className="private">
            <div className="lock">
              <LockButton></LockButton>
              <h3> This account is private. </h3>
              <p>
                {" "}
                Must follow {UserProfile.username} in order to see their account{" "}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
