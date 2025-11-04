
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) {
  throw new Error("VITE_TMDB_API_KEY is not defined. Set it in .env.local or GitHub Secrets.");
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface MovieFilters {
  genres?: number[];
  year?: number;
  minRating?: number;
  sortBy?: string;
  page?: number;
}

export const getPopularMovies = async (page = 1): Promise<MoviesResponse> => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  return res.json();
};

export const searchMovies = async (query: string, page = 1): Promise<MoviesResponse> => {
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

export const discoverMovies = async ({
  genres,
  year,
  minRating,
  sortBy = "popularity.desc",
  page = 1
}: MovieFilters): Promise<MoviesResponse> => {
  const params = new URLSearchParams({
    api_key: API_KEY,
    language: "en-US",
    sort_by: sortBy,
    page: page.toString(),
  });

  if (genres?.length) params.append("with_genres", genres.join(","));
  if (year) params.append("primary_release_year", year.toString());
  if (minRating) params.append("vote_average.gte", minRating.toString());

  const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`);
  return res.json();
};
