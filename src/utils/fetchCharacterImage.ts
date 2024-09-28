const API_KEY = '21789e220790b59b68284ae7e70e8199';
const BASE_URL = 'https://api.themoviedb.org/3/search/person';

interface TMDBMovieResult {
  profile_path: string | null;
}

interface TMDBResponse {
  results: TMDBMovieResult[];
}

export default async function fetchCharacterImage(name: string): Promise<string> {
  try {
    const queryurl = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(name)}`;
    const response = await fetch(queryurl);
    if (!response.ok) {
      throw new Error('Failed To fetch Image');
    }

    const data: TMDBResponse = await response.json();
    if (data && data.results && data.results.length > 0) {
      const profilePath = data.results[0].profile_path;
      return profilePath
        ? `https://image.tmdb.org/t/p/w500${data.results[0].profile_path}`
        : 'https://via.placeholder.com/150';
    } else {
      return 'https://via.placeholder.com/150';
    }
  } catch (error) {
    console.error('Error fetching character image:', error);
    return 'https://via.placeholder.com/150';
  }
}
