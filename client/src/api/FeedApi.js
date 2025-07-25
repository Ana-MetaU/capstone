const BASE_URL = "https://capstone-2m9n.onrender.com";

export const getFeed = async (page = 1, limit = 15) => {
  try {
    const response = await fetch(
      `${BASE_URL}/feed?page=${page}&limit=${limit}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        feed: data.feed,
        pagination: data.pagination,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("getting feed error", error);

    return {
      success: false,
      message: "exception occured in request",
    };
  }
};

export const addLike = async (watchedId) => {
  try {
    const response = await fetch(`${BASE_URL}/like/${watchedId}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error adding like", error);
    return {
      success: false,
      message: "failed to add like",
    };
  }
};

export const removeLike = async (watchedId) => {
  try {
    const response = await fetch(`${BASE_URL}/like/${watchedId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error adding like", error);
    return {
      success: false,
      message: "failed to remove like",
    };
  }
};

export const addComment = async (watchedId, text) => {
  try {
    const response = await fetch(`${BASE_URL}/comment/${watchedId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({text}),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error adding like", error);
    return {
      success: false,
      message: "failed to add comment",
    };
  }
};

export const getComments = async (watchedId) => {
  try {
    const response = await fetch(`${BASE_URL}/comment/${watchedId}`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error getting comments", error);
    return {
      success: false,
      message: "failed to get comments",
    };
  }
};
