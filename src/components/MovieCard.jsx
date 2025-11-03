import PropTypes from 'prop-types'
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE, genreIdToName } from '../constants'
import { movieShape } from '../types/propTypes'

function MovieCard({ movie, isWatched, isFavorite, isWantToWatch, onToggleWatched, onToggleFavorite, onToggleWantToWatch, onMovieClick }) {
  const posterUrl = movie.poster_path 
    ? (movie.poster_path.startsWith('http') 
        ? movie.poster_path 
        : `${IMAGE_BASE_URL}${movie.poster_path}`)
    : PLACEHOLDER_IMAGE
  
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const rating = movie.vote_average || 0
  
  const getGenre = () => {
    if (movie.genre_names && movie.genre_names.length > 0) {
      return movie.genre_names[0]
    }
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres[0].name
    }
    if (movie.genre_ids && movie.genre_ids.length > 0) {
      return genreIdToName[movie.genre_ids[0]] || 'Unknown'
    }
    return 'Unknown'
  }
  
  const genre = getGenre()

  const handleButtonClick = (e, action) => {
    e.stopPropagation()
    action()
  }

  const handleCardClick = () => {
    if (onMovieClick) {
      onMovieClick(movie)
    }
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 cursor-pointer border-2 border-transparent h-full"
    >
      <div className="relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-2 left-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={(e) => handleButtonClick(e, onToggleWatched)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isWatched 
                ? 'bg-green-500 text-white' 
                : 'bg-black/70 text-gray-300 hover:bg-green-600 hover:text-white'
            }`}
            title={isWatched ? 'Remove from watched' : 'Add to watched'}
          >
            ✓
          </button>
          <button
            onClick={(e) => handleButtonClick(e, onToggleFavorite)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-black/70 text-gray-300 hover:bg-red-600 hover:text-white'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            ♥
          </button>
          <button
            onClick={(e) => handleButtonClick(e, onToggleWantToWatch)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              isWantToWatch 
                ? 'bg-blue-500 text-white' 
                : 'bg-black/70 text-gray-300 hover:bg-blue-600 hover:text-white'
            }`}
            title={isWantToWatch ? 'Remove from want to watch' : 'Add to want to watch'}
          >
            +
          </button>
        </div>
        
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          {rating.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>{releaseYear}</span>
          <span className="px-2 py-1 bg-gray-700 rounded text-xs">{genre}</span>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
          {movie.overview || 'No overview available'}
        </p>
      </div>
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}

MovieCard.propTypes = {
  movie: movieShape.isRequired,
  isWatched: PropTypes.bool.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isWantToWatch: PropTypes.bool.isRequired,
  onToggleWatched: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleWantToWatch: PropTypes.func.isRequired,
  onMovieClick: PropTypes.func.isRequired
}

export default MovieCard

