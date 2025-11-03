import PropTypes from 'prop-types'
import MovieCard from './MovieCard'
import { movieShape } from '../types/propTypes'

function CustomMovieCard({ 
  movie, 
  isWatched, 
  isFavorite, 
  isWantToWatch, 
  onToggleWatched, 
  onToggleFavorite, 
  onToggleWantToWatch, 
  onMovieClick
}) {
  return (
    <MovieCard
      movie={movie}
      isWatched={isWatched}
      isFavorite={isFavorite}
      isWantToWatch={isWantToWatch}
      onToggleWatched={onToggleWatched}
      onToggleFavorite={onToggleFavorite}
      onToggleWantToWatch={onToggleWantToWatch}
      onMovieClick={onMovieClick}
    />
  )
}

CustomMovieCard.propTypes = {
  movie: movieShape.isRequired,
  isWatched: PropTypes.bool.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isWantToWatch: PropTypes.bool.isRequired,
  onToggleWatched: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleWantToWatch: PropTypes.func.isRequired,
  onMovieClick: PropTypes.func.isRequired
}

export default CustomMovieCard

