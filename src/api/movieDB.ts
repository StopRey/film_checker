const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  return res.json();
};

export const searchMovies = async (query: string, page = 1) => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
  );
  return res.json();
};

export const getMovieDetails = async (id: number) => {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
  return res.json();
};

export const getMovieCredits = async (id: number) => {
  const res = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`);
  return res.json();
};

interface MovieFilters {
  genres?: number[];
  year?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
}

export const discoverMovies = async ({
  genres,
  year,
  minRating,
  sortBy = "popularity.desc",
  page = 1
}: MovieFilters) => {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: sortBy,
    page: page.toString()
  });

  if (genres && genres.length > 0) {
    params.append("with_genres", genres.join(","));
  }

  if (year) {
    params.append("primary_release_year", year.toString());
  }

  if (minRating) {
    params.append("vote_average.gte", minRating.toString());
  }

  const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);
  return res.json();
};
