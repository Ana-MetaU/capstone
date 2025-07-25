import {BASE_URL} from "./constants";
// TODO: refactor this code
export const addWatchedMovie = async (movieData) => {
  try {
    const response = await fetch(`${BASE_URL}/movies/watched`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tmdbId: movieData.tmdbId,
        posterPath: movieData.posterPath,
        title: movieData.title,
        overview: movieData.overview,
        rating: movieData.rating,
        review: movieData.review,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "movie added to watched",
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "something went wrong while adding movie to watched list.",
      };
    }
  } catch (error) {
    console.log("movie watched list error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const getWatchedMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movies/watched`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        movies: data.movies, // Fixed: use movies not message
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

export const getWantToWatchMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movies/wanttowatch`, {
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        movies: data.movies, // movies or messgea?
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "something went wrong while getting want to watch movies.",
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

export const addFavoriteMovie = async (movieData) => {
  console.log("what are we getting", movieData);
  try {
    const response = await fetch(`${BASE_URL}/movies/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tmdbId: movieData.tmdbId,
        posterPath: movieData.posterPath,
        title: movieData.title,
        overview: movieData.overview,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "movie added to favorites",
      };
    } else {
      return {
        success: false,
        message:
          data.error || "something went wrong while adding movie to favorites.",
      };
    }
  } catch (error) {
    console.log("movie favorites error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const removeFavoriteMovie = async (tmdbId) => {
  try {
    const response = await fetch(`${BASE_URL}/movies/favorites/${tmdbId}`, {
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

export const addWantToWatchMovie = async (movieData) => {
  try {
    const response = await fetch(`${BASE_URL}/movies/wanttowatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tmdbId: movieData.tmdbId,
        posterPath: movieData.posterPath,
        title: movieData.title,
        overview: movieData.overview,
        // Removed rating and review - want-to-watch doesn't need these
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "movie added to want to watch",
      };
    } else {
      return {
        success: false,
        message:
          data.error ||
          "something went wrong while adding movie to want to watch.",
      };
    }
  } catch (error) {
    console.log("movie want to watch error: ", error);
    return {
      success: false,
      message: "Exception occurred in request",
    };
  }
};

export const removeWantToWatchMovie = async (tmdbId) => {
  try {
    const response = await fetch(`${BASE_URL}/movies/wanttowatch/${tmdbId}`, {
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

export const getFavoriteMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movies/favorites`, {
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
