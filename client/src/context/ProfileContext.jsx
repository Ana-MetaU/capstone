import {createContext, useContext, useState, useEffect} from "react";
import {getUserProfile, updateUserProfile} from "../api/ProfileApi";
import {useUser} from "./UserContext";
import {getUserStats} from "../api/UsersApi";

const ProfileContext = createContext();
export const ProfileProvider = ({children}) => {
  const {user} = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({});

  // Load profile when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
      fetchUserStats(user.id);
    }
  }, [user?.id]);

  // Fetch profile data with loading state
  const fetchProfile = async (userId) => {
    if (!userId) return;

    setLoading(true);

    try {
      const profileResult = await getUserProfile(userId);
      if (profileResult.success) {
        setProfile(profileResult.profile);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile with loading state
  const updateProfile = async (profileData) => {
    if (!user?.id) {
      return {success: false, message: "User not found"};
    }

    setLoading(true);

    try {
      const result = await updateUserProfile(user.id, profileData);
      if (result.success) {
        setProfile(result.profile);
      }
      return result;
    } catch (error) {
      console.error("Profile update error:", error);
      return {success: false, message: "Failed to update profile"};
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (userId) => {
    const result = await getUserStats(userId);
    setUserStats({
      tvShowsWatched: result.stats.TvShowCount,
      moviesWatched: result.stats.movieCount,
      followers: result.stats.Followers,
      following: result.stats.Following,
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        userStats,
        updateProfile,
        setProfile,
        fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
