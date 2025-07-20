const BASE_URL = "http://localhost:3000";

export const getFeed = async (page = 1, limit = 15) => {
  try {
    const response = await fetch(
      `${BASE_URL}/feed?page=${page}&limit=${limit}`,
      {credentials: "include"}
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
