import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { genreIdToName, PLACEHOLDER_IMAGE } from '../constants'
import { movieShape } from '../types/propTypes'

function MovieForm({ movie, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    release_date: '',
    vote_average: '',
    poster_path: '',
    genre_ids: [],
    genre_names: []
  })
  const [errors, setErrors] = useState({})

  const validateDate = (dateString) => {
    if (!dateString) return true
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dateString)) {
      return false
    }
    
    const date = new Date(dateString)
    const year = parseInt(dateString.substring(0, 4))
    const month = parseInt(dateString.substring(5, 7))
    const day = parseInt(dateString.substring(8, 10))
    
    if (date.getFullYear() !== year || 
        date.getMonth() + 1 !== month || 
        date.getDate() !== day) {
      return false
    }
    
    if (year < 1800 || year > 2100) {
      return false
    }
    
    return true
  }

  const genres = Object.entries(genreIdToName).map(([id, name]) => ({
    id: parseInt(id),
    name
  }))

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        overview: movie.overview || '',
        release_date: movie.release_date || '',
        vote_average: movie.vote_average?.toString() || '',
        poster_path: movie.poster_path || '',
        genre_ids: movie.genre_ids || [],
        genre_names: movie.genre_names || []
      })
    }
  }, [movie])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'release_date') {
      if (value && !validateDate(value)) {
        setErrors(prev => ({
          ...prev,
          release_date: 'Please enter a valid date in YYYY-MM-DD format'
        }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.release_date
          return newErrors
        })
      }
    }
  }

  const handleGenreToggle = (genreId, genreName) => {
    setFormData(prev => {
      const genreIds = prev.genre_ids.includes(genreId)
        ? prev.genre_ids.filter(id => id !== genreId)
        : [...prev.genre_ids, genreId]
      
      const genreNames = prev.genre_names.includes(genreName)
        ? prev.genre_names.filter(name => name !== genreName)
        : [...prev.genre_names, genreName]
      
      return {
        ...prev,
        genre_ids: genreIds,
        genre_names: genreNames
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.release_date && !validateDate(formData.release_date)) {
      setErrors(prev => ({
        ...prev,
        release_date: 'Please enter a valid date in YYYY-MM-DD format'
      }))
      return
    }
    
    const movieData = {
      ...formData,
      id: movie?.id || Date.now(),
      vote_average: parseFloat(formData.vote_average) || 0,
      popularity: movie?.popularity || 0,
      isCustom: true
    }

    onSave(movieData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <div 
        className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg shadow-2xl"
        style={{ backgroundColor: '#1d242a' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors flex items-center justify-center text-lg sm:text-xl font-bold"
        >
          ✖
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {movie ? 'Edit Movie' : 'Add New Movie'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                style={{ backgroundColor: '#15181f' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Overview
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                style={{ backgroundColor: '#15181f' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Release Date
                </label>
                <input
                  type="text"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                  className={`w-full px-4 py-2 rounded-lg text-white border transition-colors ${
                    errors.release_date 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-blue-500'
                  } focus:outline-none`}
                  style={{ backgroundColor: '#15181f' }}
                />
                {errors.release_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.release_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rating (0-10)
                </label>
                <input
                  type="number"
                  name="vote_average"
                  value={formData.vote_average}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-4 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                  style={{ backgroundColor: '#15181f' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Poster URL
              </label>
              <input
                type="url"
                name="poster_path"
                value={formData.poster_path}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 rounded-lg text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                style={{ backgroundColor: '#15181f' }}
              />
              {formData.poster_path && (
                <div className="mt-2">
                  <img
                    src={formData.poster_path}
                    alt="Preview"
                    className="w-32 h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleGenreToggle(genre.id, genre.name)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      formData.genre_ids.includes(genre.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {movie ? 'Save Changes' : 'Add Movie'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

MovieForm.propTypes = {
  movie: movieShape,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default MovieForm

