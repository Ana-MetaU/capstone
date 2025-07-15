// date: YYYY-MM-DD
export const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const getDateThreeMonthsLater = () => {
  const date = new Date();
  console.log("date", date);
  date.setMonth(date.getMonth() + 3);
  console.log("after ", date.toISOString().split("T")[0]);
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
