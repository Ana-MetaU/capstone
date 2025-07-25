// date: YYYY-MM-DD
export const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const getDateThreeMonthsLater = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split("T")[0];
};

export const removeDuplicates = (movies) => {
  const uniqueMovies = [];
  const seenIds = [];

  for (const movie of movies) {
    if (!seenIds.includes(movie.id)) {
      uniqueMovies.push(movie);
      seenIds.push(movie.id);
    }
  }

  return uniqueMovies;
};

export const getImage = (image) => {
  const tvdbUrl = "https://artworks.thetvdb.com";
  const tmdbUrl = "https://image.tmdb.org/t/p/w500";

  if (!image) {
    return "/notfound.png";
  }
  if (!image.includes("banners")) {
    return `${tmdbUrl}${image}`;
  }

  if (image.slice(0, 28).includes(tvdbUrl)) {
    return image;
  }

  return `https://artworks.thetvdb.com${image}`;
};

export const formatTimeAgo = (time) => {
  const timeToFormat = new Date(time);
  const rightNow = new Date();

  // the difference is in millisecs
  const diff = rightNow - timeToFormat;

  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 30) {
    return `${diffDays}d ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths}months ago`;
  } else if (diffYears) {
    return `${diffYears}y ago`;
  }
};
