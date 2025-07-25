import {useState, useEffect} from "react";
import {getUserProfile, updateProfilePrivacy} from "../../api/ProfileApi";
import {useUser} from "../../context/UserContext";

function Settings() {
  const {user} = useUser();
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
  }, [user]);
  const fetchPrivacySettings = async () => {
    if (!user) {
      return;
    }

    setLoading(true);

    try {
      const result = await getUserProfile(user.id);
      if (result.success) {
        setIsPublic(result.profile.isPublic);
      }
    } catch (error) {
      console.log("failed to fetch privacy settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyChange = async (newSetting) => {
    if (!user) {
      return;
    }

    setUpdating(true);
    try {
      const result = await updateProfilePrivacy(user.id, newSetting);
      if (result.success) {
        setIsPublic(newSetting);
      }
    } catch (error) {
      console.log("error updating privacy", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Settings</h2>
        <p>loading...</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Settings</h2>

      <div className="privacy">
        <h3>Privacy Settings</h3>
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => handlePrivacyChange(e.target.checked)}
            disabled={updating}
          ></input>
          Make my profile public
        </label>

        <p>
          {isPublic
            ? "Your profile is now public. Others can see your posts and follow you"
            : "Your profile is now private. Others need to request to see your content"}
        </p>
        {updating && <p>updating...</p>}
        
      </div>
    </div>
  );
}

export default Settings;
