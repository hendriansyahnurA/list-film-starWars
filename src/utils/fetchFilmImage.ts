const API_KEY = '21789e220790b59b68284ae7e70e8199';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

interface TMDBMovieResult {
  poster_path: string;
}

interface TMDBResponse {
  results: TMDBMovieResult[];
}

export default async function fetchFilmImage(title: string): Promise<string> {
  try {
    const queryURL = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
    const response = await fetch(queryURL);
    if (!response.ok) {
      throw new Error('Failed to fetch Film Image');
    }
    const data: TMDBResponse = await response.json();
    if (data && data.results && data.results.length > 0) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    } else {
      return 'https://path/to/default-placeholder.jpg';
    }
  } catch (error) {
    console.error('Error fetching film image:', error);
    return 'https://path/to/default-placeholder.jpg';
  }
}
