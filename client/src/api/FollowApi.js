import {BASE_URL} from "./constants";

export const followUser = async (userId) => {
  try {
    console.log("supp");

    const response = await fetch(
      `${BASE_URL}/follow-requests/follow/${userId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    console.log("hi", response);
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("follow user error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow-requests/unfollow/${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("unfollow user error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getFollowStatus = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow-requests/status/${userId}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        status: data.status,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("get follow status error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getFollowing = async () => {
  try {
    const response = await fetch(`${BASE_URL}/follow-requests/following`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        following: data.following,
        count: data.count,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("get following error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getFollowers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/follow-requests/followers`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        followers: data.followers,
        count: data.count,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("get following error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};
export const acceptFollowRequest = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow-requests/accept/${userId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("accept follow request error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const rejectFollowRequet = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow-requests/reject/${userId}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("reject follow request error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getIncomingRequests = async () => {
  try {
    const response = await fetch(`${BASE_URL}/follow-requests/incoming`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        requests: data.requests,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("get incoming error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getOutgoingRequest = async () => {
  try {
    const response = await fetch(`${BASE_URL}/follow-requests/outgoing`, {
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        requests: data.requests,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("get incoming error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getRecs = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow-requests/recommendations`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("get incoming error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const checkFriendOfFriendsAcess = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow-requests/friend-of-friends/${userId}`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error checking friend of friends access", error);
  }
};

export const cancelFollowRequest = async (userId) => {
  console.log("helloooo");
  try {
    const response = await fetch(
      `${BASE_URL}/follow-requests/cancel-request/${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error canceling follow request", error);
  }
};
