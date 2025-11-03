import { genreMap, genreIdToName } from '../constants'

export const getSortByString = (sortBy) => {
  if (sortBy.popularity === 'desc') return 'popularity.desc'
  if (sortBy.popularity === 'asc') return 'popularity.asc'
  if (sortBy.rating === 'desc') return 'vote_average.desc'
  if (sortBy.rating === 'asc') return 'vote_average.asc'
  if (sortBy.releaseDate === 'desc') return 'release_date.desc'
  if (sortBy.releaseDate === 'asc') return 'release_date.asc'
  return 'popularity.desc'
}

export const filterAndSortMovies = (movieList, searchQuery, filters, sortBy) => {
  let filtered = [...movieList]

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(movie => 
      movie.title?.toLowerCase().includes(query) ||
      movie.overview?.toLowerCase().includes(query)
    )
  }

  if (filters.genre) {
    const genreId = genreMap[filters.genre] || parseInt(filters.genre)
    const genreName = genreIdToName[genreId]
    
    if (genreId) {
      filtered = filtered.filter(movie => {
        if (movie.genre_ids?.includes(genreId)) return true
        
        if (movie.genres && Array.isArray(movie.genres)) {
          const hasGenreById = movie.genres.some(g => g.id === genreId)
          if (hasGenreById) return true
          
          if (genreName) {
            const hasGenreByName = movie.genres.some(g => 
              g.name?.toLowerCase().includes(genreName.toLowerCase())
            )
            if (hasGenreByName) return true
          }
        }
        
        if (movie.genre_names && Array.isArray(movie.genre_names)) {
          if (genreName) {
            return movie.genre_names.some(name => 
              name.toLowerCase().includes(genreName.toLowerCase())
            )
          }
        }
        
        return false
      })
    }
  }

  if (filters.year) {
    const year = parseInt(filters.year)
    filtered = filtered.filter(movie => {
      const movieYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null
      return movieYear === year
    })
  }

  if (filters.minRating) {
    const minRating = parseFloat(filters.minRating)
    filtered = filtered.filter(movie => 
      (movie.vote_average || 0) >= minRating
    )
  }

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

