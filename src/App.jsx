import { useState, useEffect, useCallback } from 'react'
import { searchMovies, discoverMovies, getMovieDetails, getMovieCredits } from './api/movieDB'
import './App.css'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

/* eslint-disable react/prop-types */
function MovieCard({ movie, isWatched, isFavorite, isWantToWatch, onToggleWatched, onToggleFavorite, onToggleWantToWatch, onMovieClick }) {
  const posterUrl = movie.poster_path 
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image'
  
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const rating = movie.vote_average || 0
  const genre = movie.genre_names?.[0] || 'Unknown'

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
      className="group relative bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 cursor-pointer border-2 border-transparent"
    >
      <div className="relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
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
/* eslint-enable react/prop-types */

/* eslint-disable react/prop-types */
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
  onToggleWantToWatch
}) {
  if (!movie && !loading) return null

  const posterUrl = details?.poster_path 
    ? `${IMAGE_BASE_URL}${details.poster_path}`
    : movie?.poster_path 
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image'

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
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors flex items-center justify-center text-lg sm:text-xl font-bold"
        >
          ✖
        </button>

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
                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
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
/* eslint-enable react/prop-types */

const genreMap = {
  'action': 28,
  'comedy': 35,
  'drama': 18,
  'horror': 27,
  'sci-fi': 878
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [watchedMovies, setWatchedMovies] = useState([])
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [wantToWatchMovies, setWantToWatchMovies] = useState([])
  const [sortBy, setSortBy] = useState({
    popularity: null,
    rating: null,
    releaseDate: null
  })
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    minRating: ''
  })
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetails, setMovieDetails] = useState(null)
  const [movieCredits, setMovieCredits] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'watched', label: 'Watched' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'toWatch', label: 'Want to Watch' }
  ]

  const getSortByString = useCallback(() => {
    if (sortBy.popularity === 'desc') return 'popularity.desc'
    if (sortBy.popularity === 'asc') return 'popularity.asc'
    if (sortBy.rating === 'desc') return 'vote_average.desc'
    if (sortBy.rating === 'asc') return 'vote_average.asc'
    if (sortBy.releaseDate === 'desc') return 'release_date.desc'
    if (sortBy.releaseDate === 'asc') return 'release_date.asc'
    return 'popularity.desc'
  }, [sortBy])

  const fetchMovies = useCallback(async () => {
    if (activeTab !== 'home') return
    
    setLoading(true)
    try {
      let response
      
      if (searchQuery.trim()) {
        response = await searchMovies(searchQuery, currentPage)
      } else {
        const sortByString = getSortByString()
        const genreIds = filters.genre ? [genreMap[filters.genre]] : undefined
        const year = filters.year ? parseInt(filters.year) : undefined
        const minRating = filters.minRating ? parseFloat(filters.minRating) : undefined
        
        response = await discoverMovies({
          genres: genreIds,
          year: year,
          minRating: minRating,
          sortBy: sortByString,
          page: currentPage
        })
      }
      
      if (response.results) {
        setMovies(response.results)
        setTotalPages(response.total_pages || 1)
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      setMovies([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filters, activeTab, getSortByString, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy, filters])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const handleSort = (sortType) => {
    setSortBy(prev => {
      const current = prev[sortType]
      const newState = {
        popularity: null,
        rating: null,
        releaseDate: null
      }
      
      if (current === null) {
        newState[sortType] = 'desc'
      } else if (current === 'desc') {
        newState[sortType] = 'asc'
      } else {
        newState[sortType] = null
      }
      
      return newState
    })
  }

  const getSortIcon = (sortType) => {
    const current = sortBy[sortType]
    if (current === 'desc') return '↓'
    if (current === 'asc') return '↑'
    return null
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const toggleWatched = (movie) => {
    setWatchedMovies(prev => {
      const exists = prev.find(m => m.id === movie.id)
      if (exists) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, movie]
      }
    })
  }

  const toggleFavorite = (movie) => {
    setFavoriteMovies(prev => {
      const exists = prev.find(m => m.id === movie.id)
      if (exists) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, movie]
      }
    })
  }

  const toggleWantToWatch = (movie) => {
    setWantToWatchMovies(prev => {
      const exists = prev.find(m => m.id === movie.id)
      if (exists) {
        return prev.filter(m => m.id !== movie.id)
      } else {
        return [...prev, movie]
      }
    })
  }

  const isMovieWatched = (movieId) => watchedMovies.some(m => m.id === movieId)
  const isMovieFavorite = (movieId) => favoriteMovies.some(m => m.id === movieId)
  const isMovieWantToWatch = (movieId) => wantToWatchMovies.some(m => m.id === movieId)

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie)
    setLoadingDetails(true)
    setMovieDetails(null)
    setMovieCredits(null)
    
    try {
      const [details, credits] = await Promise.all([
        getMovieDetails(movie.id),
        getMovieCredits(movie.id)
      ])
      setMovieDetails(details)
      setMovieCredits(credits)
    } catch (error) {
      console.error('Error fetching movie details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const closeMovieModal = () => {
    setSelectedMovie(null)
    setMovieDetails(null)
    setMovieCredits(null)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSortBy({
      popularity: null,
      rating: null,
      releaseDate: null
    })
    setFilters({
      genre: '',
      year: '',
      minRating: ''
    })
  }

  const filterAndSortMovies = (movieList) => {
    let filtered = [...movieList]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(movie => 
        movie.title?.toLowerCase().includes(query) ||
        movie.overview?.toLowerCase().includes(query)
      )
    }

    // Apply genre filter
    if (filters.genre) {
      const genreId = genreMap[filters.genre]
      const genreNameMap = {
        'action': ['action'],
        'comedy': ['comedy'],
        'drama': ['drama'],
        'horror': ['horror'],
        'sci-fi': ['sci-fi', 'science fiction', 'science-fiction']
      }
      const genreNames = genreNameMap[filters.genre] || [filters.genre]
      
      filtered = filtered.filter(movie => {
        // Check by genre ID
        if (movie.genre_ids?.includes(genreId)) return true
        
        // Check by genre names
        if (movie.genre_names && Array.isArray(movie.genre_names)) {
          return movie.genre_names.some(name => 
            genreNames.some(gn => name.toLowerCase().includes(gn.toLowerCase()))
          )
        }
        
        return false
      })
    }

    // Apply year filter
    if (filters.year) {
      const year = parseInt(filters.year)
      filtered = filtered.filter(movie => {
        const movieYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null
        return movieYear === year
      })
    }

    // Apply minimum rating filter
    if (filters.minRating) {
      const minRating = parseFloat(filters.minRating)
      filtered = filtered.filter(movie => 
        (movie.vote_average || 0) >= minRating
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy.popularity === 'desc') {
        return (b.popularity || 0) - (a.popularity || 0)
      } else if (sortBy.popularity === 'asc') {
        return (a.popularity || 0) - (b.popularity || 0)
      } else if (sortBy.rating === 'desc') {
        return (b.vote_average || 0) - (a.vote_average || 0)
      } else if (sortBy.rating === 'asc') {
        return (a.vote_average || 0) - (b.vote_average || 0)
      } else if (sortBy.releaseDate === 'desc') {
        const dateA = a.release_date ? new Date(a.release_date) : new Date(0)
        const dateB = b.release_date ? new Date(b.release_date) : new Date(0)
        return dateB - dateA
      } else if (sortBy.releaseDate === 'asc') {
        const dateA = a.release_date ? new Date(a.release_date) : new Date(0)
        const dateB = b.release_date ? new Date(b.release_date) : new Date(0)
        return dateA - dateB
      }
      return 0
    })

    return filtered
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#15181f' }}>
      <header 
        className="sticky top-0 z-50 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: '#0f1014' }}
      >
        <h1 className="text-xl md:text-2xl font-bold text-white">
          Film Checker
        </h1>
        <div className="w-full md:flex-1 md:max-w-md md:ml-8">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
            style={{ backgroundColor: '#1d242a' }}
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-[350px] lg:flex-shrink-0 lg:flex-grow-0 p-4 md:p-6">
          <div className="rounded-lg p-4 md:p-6 space-y-6" style={{ backgroundColor: '#1d242a' }}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 min-h-[30px]">
                <h2 className="text-lg md:text-xl font-semibold text-white">Sorting</h2>
                <button
                  onClick={clearAllFilters}
                  className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${
                    (sortBy.popularity || sortBy.rating || sortBy.releaseDate || filters.genre || filters.year || filters.minRating || searchQuery)
                      ? 'text-red-400 hover:text-red-300 border-red-500/50 hover:bg-red-500/10 opacity-100 visible'
                      : 'opacity-0 invisible pointer-events-none'
                  }`}
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleSort('popularity')}
                  className={`w-full px-4 py-3 rounded-lg text-white border transition-all duration-200 focus:outline-none text-left flex items-center justify-between ${
                    sortBy.popularity 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: sortBy.popularity ? '#1d242a' : '#1d242a',
                    borderColor: sortBy.popularity ? '#3b82f6' : '#374151'
                  }}
                >
                  <span className="font-medium">Popularity</span>
                  <span className="text-blue-400 text-lg font-bold min-w-[20px] text-center">
                    {getSortIcon('popularity') || ''}
                  </span>
                </button>
                <button 
                  onClick={() => handleSort('rating')}
                  className={`w-full px-4 py-3 rounded-lg text-white border transition-all duration-200 focus:outline-none text-left flex items-center justify-between ${
                    sortBy.rating 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: sortBy.rating ? '#1d242a' : '#1d242a',
                    borderColor: sortBy.rating ? '#3b82f6' : '#374151'
                  }}
                >
                  <span className="font-medium">Rating</span>
                  <span className="text-blue-400 text-lg font-bold min-w-[20px] text-center">
                    {getSortIcon('rating') || ''}
                  </span>
                </button>
                <button 
                  onClick={() => handleSort('releaseDate')}
                  className={`w-full px-4 py-3 rounded-lg text-white border transition-all duration-200 focus:outline-none text-left flex items-center justify-between ${
                    sortBy.releaseDate 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: sortBy.releaseDate ? '#1d242a' : '#1d242a',
                    borderColor: sortBy.releaseDate ? '#3b82f6' : '#374151'
                  }}
                >
                  <span className="font-medium">Release Date</span>
                  <span className="text-blue-400 text-lg font-bold min-w-[20px] text-center">
                    {getSortIcon('releaseDate') || ''}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select 
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ backgroundColor: '#1d242a' }}
                  >
                    <option value="" style={{ backgroundColor: '#1d242a' }}>All genres</option>
                    <option value="action" style={{ backgroundColor: '#1d242a' }}>Action</option>
                    <option value="comedy" style={{ backgroundColor: '#1d242a' }}>Comedy</option>
                    <option value="drama" style={{ backgroundColor: '#1d242a' }}>Drama</option>
                    <option value="horror" style={{ backgroundColor: '#1d242a' }}>Horror</option>
                    <option value="sci-fi" style={{ backgroundColor: '#1d242a' }}>Science Fiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Year
                  </label>
                  <select 
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ backgroundColor: '#1d242a' }}
                  >
                    <option value="" style={{ backgroundColor: '#1d242a' }}>All years</option>
                    <option value="2024" style={{ backgroundColor: '#1d242a' }}>2024</option>
                    <option value="2023" style={{ backgroundColor: '#1d242a' }}>2023</option>
                    <option value="2022" style={{ backgroundColor: '#1d242a' }}>2022</option>
                    <option value="2021" style={{ backgroundColor: '#1d242a' }}>2021</option>
                    <option value="2020" style={{ backgroundColor: '#1d242a' }}>2020</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Rating
                  </label>
                  <select 
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ backgroundColor: '#1d242a' }}
                  >
                    <option value="" style={{ backgroundColor: '#1d242a' }}>All ratings</option>
                    <option value="9" style={{ backgroundColor: '#1d242a' }}>9+</option>
                    <option value="8" style={{ backgroundColor: '#1d242a' }}>8+</option>
                    <option value="7" style={{ backgroundColor: '#1d242a' }}>7+</option>
                    <option value="6" style={{ backgroundColor: '#1d242a' }}>6+</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="w-full lg:flex-1 lg:min-w-0 p-4 md:p-6">
          <div className="mb-6 border-b border-gray-700 overflow-x-auto">
            <nav className="flex space-x-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 md:px-6 py-3 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'home' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Movies Browser'}
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Loading...</div>
                  </div>
                ) : movies.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {movies.map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie}
                          isWatched={isMovieWatched(movie.id)}
                          isFavorite={isMovieFavorite(movie.id)}
                          isWantToWatch={isMovieWantToWatch(movie.id)}
                          onToggleWatched={() => toggleWatched(movie)}
                          onToggleFavorite={() => toggleFavorite(movie)}
                          onToggleWantToWatch={() => toggleWantToWatch(movie)}
                          onMovieClick={handleMovieClick}
                        />
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-lg text-white border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                          style={{ 
                            backgroundColor: '#1d242a',
                            borderColor: '#374151'
                          }}
                        >
                          Previous
                        </button>
                        
                        {currentPage > 3 && totalPages > 5 && (
                          <>
                            <button
                              onClick={() => handlePageChange(1)}
                              className="px-4 py-2 rounded-lg text-white border transition-colors hover:bg-gray-700"
                              style={{ 
                                backgroundColor: '#1d242a',
                                borderColor: '#374151'
                              }}
                            >
                              1
                            </button>
                            {currentPage > 4 && (
                              <span className="text-gray-400 px-2">...</span>
                            )}
                          </>
                        )}
                        
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg text-white border transition-colors ${
                                  currentPage === pageNum 
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                                    : 'hover:bg-gray-700'
                                }`}
                                style={{ 
                                  backgroundColor: currentPage === pageNum ? '#3b82f6' : '#1d242a',
                                  borderColor: currentPage === pageNum ? '#3b82f6' : '#374151'
                                }}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                        </div>
                        
                        {currentPage < totalPages - 2 && totalPages > 5 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <span className="text-gray-400 px-2">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="px-4 py-2 rounded-lg text-white border transition-colors hover:bg-gray-700"
                              style={{ 
                                backgroundColor: '#1d242a',
                                borderColor: '#374151'
                              }}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-lg text-white border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
                          style={{ 
                            backgroundColor: '#1d242a',
                            borderColor: '#374151'
                          }}
                        >
                          Next
                        </button>
                        
                        <span className="text-gray-400 text-sm px-2">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400 text-xl">No movies found</div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'watched' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  Watched Movies
                  {filterAndSortMovies(watchedMovies).length !== watchedMovies.length && (
                    <span className="text-sm text-gray-400 font-normal ml-2">
                      ({filterAndSortMovies(watchedMovies).length} of {watchedMovies.length})
                    </span>
                  )}
                </h2>
                {watchedMovies.length > 0 ? (
                  filterAndSortMovies(watchedMovies).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {filterAndSortMovies(watchedMovies).map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie}
                          isWatched={isMovieWatched(movie.id)}
                          isFavorite={isMovieFavorite(movie.id)}
                          isWantToWatch={isMovieWantToWatch(movie.id)}
                          onToggleWatched={() => toggleWatched(movie)}
                          onToggleFavorite={() => toggleFavorite(movie)}
                          onToggleWantToWatch={() => toggleWantToWatch(movie)}
                          onMovieClick={handleMovieClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-gray-400 text-xl">No movies match your filters</div>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400 text-xl">No watched movies yet</div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  Favorite Movies
                  {filterAndSortMovies(favoriteMovies).length !== favoriteMovies.length && (
                    <span className="text-sm text-gray-400 font-normal ml-2">
                      ({filterAndSortMovies(favoriteMovies).length} of {favoriteMovies.length})
                    </span>
                  )}
                </h2>
                {favoriteMovies.length > 0 ? (
                  filterAndSortMovies(favoriteMovies).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {filterAndSortMovies(favoriteMovies).map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie}
                          isWatched={isMovieWatched(movie.id)}
                          isFavorite={isMovieFavorite(movie.id)}
                          isWantToWatch={isMovieWantToWatch(movie.id)}
                          onToggleWatched={() => toggleWatched(movie)}
                          onToggleFavorite={() => toggleFavorite(movie)}
                          onToggleWantToWatch={() => toggleWantToWatch(movie)}
                          onMovieClick={handleMovieClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-gray-400 text-xl">No movies match your filters</div>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400 text-xl">No favorite movies yet</div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'toWatch' && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  Want to Watch
                  {filterAndSortMovies(wantToWatchMovies).length !== wantToWatchMovies.length && (
                    <span className="text-sm text-gray-400 font-normal ml-2">
                      ({filterAndSortMovies(wantToWatchMovies).length} of {wantToWatchMovies.length})
                    </span>
                  )}
                </h2>
                {wantToWatchMovies.length > 0 ? (
                  filterAndSortMovies(wantToWatchMovies).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {filterAndSortMovies(wantToWatchMovies).map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie}
                          isWatched={isMovieWatched(movie.id)}
                          isFavorite={isMovieFavorite(movie.id)}
                          isWantToWatch={isMovieWantToWatch(movie.id)}
                          onToggleWatched={() => toggleWatched(movie)}
                          onToggleFavorite={() => toggleFavorite(movie)}
                          onToggleWantToWatch={() => toggleWantToWatch(movie)}
                          onMovieClick={handleMovieClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-gray-400 text-xl">No movies match your filters</div>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-gray-400 text-xl">No movies in your watchlist yet</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          details={movieDetails}
          credits={movieCredits}
          loading={loadingDetails}
          isWatched={isMovieWatched(selectedMovie.id)}
          isFavorite={isMovieFavorite(selectedMovie.id)}
          isWantToWatch={isMovieWantToWatch(selectedMovie.id)}
          onClose={closeMovieModal}
          onToggleWatched={toggleWatched}
          onToggleFavorite={toggleFavorite}
          onToggleWantToWatch={toggleWantToWatch}
        />
      )}
    </div>
  )
}

export default App

