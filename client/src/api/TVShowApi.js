import {BASE_URL} from "./constants";

export const addWatchedTVShow = async (showData) => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/watched`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tvdbId: showData.tvdbId,
        posterPath: showData.posterPath,
        name: showData.name,
        overview: showData.overview,
        rating: showData.rating,
        review: showData.review,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "TV show added to watched",
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "something went wrong while adding TV show to watched list.",
      };
    }
  } catch (error) {
    console.log("TV show watched list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getWatchedTVShows = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/watched`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        shows: data.shows,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting TV shows.",
      };
    }
  } catch (error) {
    console.log("getting TV show list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getWantToWatchTVShows = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/wanttowatch`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        shows: data.shows,
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "something went wrong while getting want to watch TV shows.",
      };
    }
  } catch (error) {
    console.log("getting TV show list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const addFavoriteTVShow = async (showData) => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tvdbId: showData.tvdbId,
        posterPath: showData.posterPath,
        name: showData.name,
        overview: showData.overview,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "TV show added to favorites",
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "something went wrong while adding TV show to favorites.",
      };
    }
  } catch (error) {
    console.log("TV show favorites error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const removeFavoriteTVShow = async (tvdbId) => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/favorites/${tvdbId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.error || "Something went wrong while removing favorite",
      };
    }
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const addWantToWatchTVShow = async (showData) => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/wanttowatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tvdbId: showData.tvdbId,
        posterPath: showData.posterPath,
        name: showData.name,
        overview: showData.posterPath,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "TV show added to want to watch",
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "something went wrong while adding TV show to want to watch.",
      };
    }
  } catch (error) {
    console.log("TV show want to watch error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const removeWantToWatchTVShow = async (tvdbId) => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/wanttowatch/${tvdbId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "Something went wrong while removing from want to watch",
      };
    }
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getFavoriteTVShows = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/favorites`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        shows: data.shows,
      };
    } else {
      return {
        success: false,
        message: data.error || "something went wrong while getting favorites.",
      };
    }
  } catch (error) {
    console.log("getting favorites error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getCurrentlyWatchingTVShows = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tvshows/currentlywatching`, {
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        shows: data.shows,
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "Something went wrong while getting currently watching TV shows.",
      };
    }
  } catch (error) {
    console.log("Error fetching currently watching TV shows:", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};
