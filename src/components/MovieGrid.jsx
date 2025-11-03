import PropTypes from 'prop-types'
import MovieCard from './MovieCard'
import { movieShape } from '../types/propTypes'

function MovieGrid({ movies, isMovieWatched, isMovieFavorite, isMovieWantToWatch, onToggleWatched, onToggleFavorite, onToggleWantToWatch, onMovieClick }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          movie={movie}
          isWatched={isMovieWatched(movie.id)}
          isFavorite={isMovieFavorite(movie.id)}
          isWantToWatch={isMovieWantToWatch(movie.id)}
          onToggleWatched={() => onToggleWatched(movie)}
          onToggleFavorite={() => onToggleFavorite(movie)}
          onToggleWantToWatch={() => onToggleWantToWatch(movie)}
          onMovieClick={onMovieClick}
        />
      ))}
    </div>
  )
}

MovieGrid.propTypes = {
  movies: PropTypes.arrayOf(movieShape).isRequired,
  isMovieWatched: PropTypes.func.isRequired,
  isMovieFavorite: PropTypes.func.isRequired,
  isMovieWantToWatch: PropTypes.func.isRequired,
  onToggleWatched: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleWantToWatch: PropTypes.func.isRequired,
  onMovieClick: PropTypes.func.isRequired
}

export default MovieGrid

