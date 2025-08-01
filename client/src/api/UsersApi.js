import {BASE_URL} from "./constants";
export const getUserProfileByUsername = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${username}`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        profile: data.profile,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("getting profile by username error error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const searchUsersByUsername = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/search?q=${encodeURIComponent(query)}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        results: data.results,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("search users error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/stats`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        stats: data.stats,
      };
    } else {
      return {
        success: false,
        message: data.error,
      };
    }
  } catch (error) {
    console.log("search users error", error);
    return {
      success: false,
      message: "Exception occured in request",
    };
  }
};

export const getUserWatchedMovies = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/movies/watched`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        movies: data.movies,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting movies.",
      };
    }
  } catch (error) {
    console.log("getting movie list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getUserWatchedShows = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/tvshows/watched`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        shows: data.movies,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting movies.",
      };
    }
  } catch (error) {
    console.log("getting movie list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getUserFavoriteShows = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/tvshows/favorites`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        shows: data.movies,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting movies.",
      };
    }
  } catch (error) {
    console.log("getting movie list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getUserFavoriteMovies = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/movies/favorites`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        movies: data.movies,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting movies.",
      };
    }
  } catch (error) {
    console.log("getting movie list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getUserWantToWatchMovies = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/movies/wanttowatch`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        movies: data.movies,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting movies.",
      };
    }
  } catch (error) {
    console.log("getting movie list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getUserWantToWatchShows = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/tvshows/wanttowatch`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        shows: data.movies,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting movies.",
      };
    }
  } catch (error) {
    console.log("getting movie list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getWatchGoal = async (userId, currentYear) => {
  try {
    const response = await fetch(
      `${BASE_URL}/users/${userId}/goal/${currentYear}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        goal: data.goal,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting the goal.",
      };
    }
  } catch (error) {
    console.log("getting watch goal error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const setWatchGoal = async (userId, currentYear, newGoal) => {
  console.log("what is going on ", userId, currentYear, newGoal);
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/goal`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({year: currentYear, goal: newGoal}),
    });
    console.log("what is the repsonse", response);
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        goal: data,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while setting the goal.",
      };
    }
  } catch (error) {
    console.log("setting watch goal error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};
