import PropTypes from 'prop-types'
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE } from '../constants'
import { movieShape } from '../types/propTypes'

function MovieModal({ 
  movie, 
  details, 
  credits, 
  loading, 
  isWatched, 
  isFavorite, 
  isWantToWatch,
  onClose,
  onToggleWatched,
  onToggleFavorite,
  onToggleWantToWatch,
  onEdit,
  onDelete
}) {
  if (!movie && !loading) return null

  const getPosterUrl = () => {
    if (details?.poster_path) {
      return details.poster_path.startsWith('http') 
        ? details.poster_path 
        : `${IMAGE_BASE_URL}${details.poster_path}`
    }
    if (movie?.poster_path) {
      return movie.poster_path.startsWith('http') 
        ? movie.poster_path 
        : `${IMAGE_BASE_URL}${movie.poster_path}`
    }
    return PLACEHOLDER_IMAGE
  }

  const posterUrl = getPosterUrl()

  const backdropUrl = details?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
    : null

  const director = credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown'
  const actors = credits?.cast?.slice(0, 10) || []
  const genres = details?.genres?.map(g => g.name) || movie?.genre_names || []

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
        style={{ backgroundColor: '#1d242a' }}
        onClick={(e) => e.stopPropagation()}
      >
        {backdropUrl && (
          <div className="relative h-40 sm:h-48 md:h-64 lg:h-80 w-full">
            <img
              src={backdropUrl}
              alt={details?.title || movie?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1d242a]" />
          </div>
        )}
        
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-2">
          {(movie?.isCustom || details?.isCustom) && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onEdit) {
                    onEdit(details || movie)
                    onClose()
                  }
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg"
                title="Edit movie"
              >
                ✎
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onDelete && window.confirm('Are you sure you want to delete this movie?')) {
                    onDelete((details || movie).id)
                    onClose()
                  }
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg"
                title="Delete movie"
              >
                ✕
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors flex items-center justify-center text-lg sm:text-xl font-bold"
            title="Close"
          >
            ✖
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <div className="text-white text-lg sm:text-xl">Loading...</div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
                <img
                  src={posterUrl}
                  alt={details?.title || movie?.title}
                  className="w-32 sm:w-40 md:w-48 lg:w-64 h-auto rounded-lg object-cover mx-auto md:mx-0 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE
                  }}
                />
                
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                    {details?.title || movie?.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    {details?.release_date && (
                      <span className="text-gray-400 text-sm sm:text-base">
                        {new Date(details.release_date).getFullYear()}
                      </span>
                    )}
                    {details?.runtime && (
                      <span className="text-gray-400 text-sm sm:text-base">
                        {details.runtime} min
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold">
                        {(details?.vote_average || movie?.vote_average || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <button
                      onClick={() => onToggleWatched(details || movie)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                        isWatched
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {isWatched ? '✓ Watched' : 'Mark as Watched'}
                    </button>
                    <button
                      onClick={() => onToggleFavorite(details || movie)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                        isFavorite
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {isFavorite ? '♥ Favorite' : 'Add to Favorites'}
                    </button>
                    <button
                      onClick={() => onToggleWantToWatch(details || movie)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                        isWantToWatch
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {isWantToWatch ? '+ Want to Watch' : 'Want to Watch'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {details?.overview || movie?.overview || 'No description available'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Director</h3>
                  <p className="text-gray-300 text-sm sm:text-base">{director}</p>
                </div>

                {actors.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Actors</h3>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
                      {actors.map((actor) => (
                        <div
                          key={actor.id}
                          className="bg-gray-800 rounded-lg p-2 sm:p-3"
                        >
                          <p className="text-white text-sm sm:text-base font-medium">{actor.name}</p>
                          <p className="text-gray-400 text-xs sm:text-sm">{actor.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

MovieModal.propTypes = {
  movie: movieShape,
  details: movieShape,
  credits: PropTypes.shape({
    cast: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      character: PropTypes.string
    })),
    crew: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      job: PropTypes.string
    }))
  }),
  loading: PropTypes.bool.isRequired,
  isWatched: PropTypes.bool.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isWantToWatch: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onToggleWatched: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onToggleWantToWatch: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
}

export default MovieModal

