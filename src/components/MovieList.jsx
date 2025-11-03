import PropTypes from 'prop-types'
import MovieGrid from './MovieGrid'
import { filterAndSortMovies } from '../utils/movieUtils'
import { movieShape, sortByShape, filtersShape } from '../types/propTypes'

function MovieList({ movies, searchQuery, filters, sortBy, isMovieWatched, isMovieFavorite, isMovieWantToWatch, onToggleWatched, onToggleFavorite, onToggleWantToWatch, onMovieClick, title, emptyMessage }) {
  const filteredMovies = filterAndSortMovies(movies, searchQuery, filters, sortBy)
  const isFiltered = filteredMovies.length !== movies.length

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
        {title}
        {isFiltered && (
          <span className="text-sm text-gray-400 font-normal ml-2">
            ({filteredMovies.length} of {movies.length})
          </span>
        )}
      </h2>
      {movies.length > 0 ? (
        filteredMovies.length > 0 ? (
          <MovieGrid
            movies={filteredMovies}
            isMovieWatched={isMovieWatched}
            isMovieFavorite={isMovieFavorite}
            isMovieWantToWatch={isMovieWantToWatch}
            onToggleWatched={onToggleWatched}
            onToggleFavorite={onToggleFavorite}
            onToggleWantToWatch={onToggleWantToWatch}
            onMovieClick={onMovieClick}
          />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400 text-xl">No movies match your filters</div>
          </div>
        )
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-xl">{emptyMessage}</div>
        </div>
      )}
    </div>
  )
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(movieShape).isRequired,
  searchQuery: PropTypes.string.isRequired,
  filters: filtersShape.isRequired,
  sortBy: sortByShape.isRequired,
  isMovieWatched: PropTypes.func.isRequired,
  isMovieFavorite: PropTypes.func.isRequired,
  isMovieWantToWatch: PropTypes.func.isRequired,
  onToggleWatched: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleWantToWatch: PropTypes.func.isRequired,
  onMovieClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired
}

export default MovieList

