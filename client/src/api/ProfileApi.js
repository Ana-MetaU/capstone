const BASE_URL = "http://localhost:3000";
export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/profile/${userId}`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        profile: data,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting profile.",
      };
    }
  } catch (error) {
    console.log("getting profile error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

// Create user profile
export const createUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${BASE_URL}/profile/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        bio: profileData.bio,
        privateLevel: profileData.privateLevel,
        profilePicture: profileData.profilePicture,
        favoriteGenres: profileData.favoriteGenres,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        profile: data,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while creating profile.",
      };
    }
  } catch (error) {
    console.log("profile creation error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${BASE_URL}/profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        bio: profileData.bio,
        privacyLevel: profileData.privacyLevel,
        profilePicture: profileData.profilePicture,
        favoriteGenres: profileData.favoriteGenres,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        profile: data.updatedProfile,
        message: "profile updated successfully",
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while updating profile.",
      };
    }
  } catch (error) {
    console.log("profile update error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

// Check if user has a profile
export const userHasProfile = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/profile/${userId}/exists`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        hasProfile: data.hasProfile,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while checking profile.",
      };
    }
  } catch (error) {
    console.log("checking profile error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const updateProfilePrivacy = async (userId, privacyLevel) => {
  try {
    const response = await fetch(`${BASE_URL}/profile/${userId}/privacy`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(privacyLevel),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message,
        profile: data.profile,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("privacy update error", error);
    return {
      success: true,
      message: "exception occured in request",
    };
  }
};
