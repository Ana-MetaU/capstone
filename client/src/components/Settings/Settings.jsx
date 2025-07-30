import {useState, useEffect} from "react";
import {getUserProfile, updateProfilePrivacy} from "../../api/ProfileApi";
import {useUser} from "../../context/UserContext";
import "./Settings.css";
function Settings() {
  const {user} = useUser();
  const [privacyLevel, setPrivacyLevel] = useState("public");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const privacyOptions = [
    {
      value: "friends_only",
      label: "Private",
      description: " Only your friends can see your profile and posts",
    },
    {
      value: "friends_of_friends",
      label: "Friends of Friends",
      description:
        " Your friends and and their friends can see your profile and posts",
    },
    {
      value: "public",
      label: "Public",
      description: " Everyone can see your profile and posts",
    },
  ];
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
        setPrivacyLevel(result.profile.privacyLevel);
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
      const result = await updateProfilePrivacy(user.id, {
        privacyLevel: newSetting,
      });
      if (result.success) {
        setPrivacyLevel(newSetting);
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
      <h3>Visibility</h3>

      <div className="privacy">
        {privacyOptions.map((option) => (
          <label key={option.value} className="privacy-label">
            <div className="privacy-option">
              <input
                type="radio"
                name="privacy"
                value={option.value}
                checked={privacyLevel === option.value}
                onChange={(e) => handlePrivacyChange(e.target.value)}
                disabled={updating}
              ></input>
            </div>
            <p>{option.label}</p>
          </label>
        ))}{" "}
        <p>
          Selection: 
          {
            privacyOptions.find((option) => option.value === privacyLevel)
              ?.description
          }
        </p>
        {updating && <p>updating...</p>}
      </div>
    </div>
  );
}

export default Settings;
