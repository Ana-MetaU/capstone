import {useState, useRef} from "react";
import "./EditProfileModal.css";
import {createUserProfile, updateUserProfile} from "../../api/ProfileApi";

// TODO: potentially incorporate withAuth because passing it down as a prop does not seem secured since does not mean that the user is logged in and can update, but backend protects against editing as well.
const EditProfileModal = ({
  isOpen,
  onClose,
  currentProfile,
  userId,
  onProfileUpdate,
}) => {
  const fileInputRef = useRef(null);
  const [bio, setBio] = useState(currentProfile?.bio || "");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    currentProfile?.profilePicture || "/image.png"
  );

  const [favoriteGenres, setFavoriteGenres] = useState(
    currentProfile?.favoriteGenres || []
  );

  const availableGenres = ["Romance", "Action", "Drama", "Thriller"];

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleGenreChange = (genre) => {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Upload image if there's a new one
      let imageUrl = imagePreview;

      if (fileInputRef.current.files.length > 0) {
        const formData = new FormData();
        formData.append("ProfilePicture", fileInputRef.current.files[0]);

        const uploadResponse = await fetch(
          "http://localhost:3000/upload/profile-picture",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.imageUrl;
        }
      }

      // Save profile data
      const profileData = {
        bio,
        isPublic: true,
        profilePicture: imageUrl,
        favoriteGenres,
      };

      // post the data to the backend
      let profileResponse;
      if (currentProfile) {
        profileResponse = await updateUserProfile(userId, profileData);
      } else {
        profileResponse = await createUserProfile(userId, profileData); //safeguard because profile should have been created at login after first signing up.
      }
      // close the modal
      onClose();

      //fetch the freshly posted data
      onProfileUpdate();

      // trigger a window refresh, so profile updates
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving profile:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Profile</h2>
        </div>

        <div className="modal-body">
          <div className="form">
            <div className="profile-picture-section">
              <label>Profile Picture</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{display: "none"}}
              />
              <div
                className="profile-picture-upload"
                onClick={handleImageClick}
              >
                <img src={imagePreview} alt="Profile preview" />
                <div className="upload-overlay">
                  <span>Click to change</span>
                </div>
              </div>
            </div>

            <div className="bio-section">
              <label>Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                maxLength={150}
              />
            </div>
          </div>

          <div className="genres-section">
            <label>Favorite Genres</label>
            <div className="genres-checkboxes">
              {availableGenres.map((genre) => (
                <label key={genre} className="genre-checkbox">
                  <input
                    type="checkbox"
                    checked={favoriteGenres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button
              className={isLoading ? "save-button-active" : "save-button"}
              onClick={handleSave}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
