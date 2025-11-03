import PropTypes from 'prop-types'

export const movieShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string,
  overview: PropTypes.string,
  release_date: PropTypes.string,
  vote_average: PropTypes.number,
  poster_path: PropTypes.string,
  genre_ids: PropTypes.arrayOf(PropTypes.number),
  genre_names: PropTypes.arrayOf(PropTypes.string),
  genres: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })),
  popularity: PropTypes.number,
  isCustom: PropTypes.bool
})

export const sortByShape = PropTypes.shape({
  popularity: PropTypes.oneOf([null, 'asc', 'desc']),
  rating: PropTypes.oneOf([null, 'asc', 'desc']),
  releaseDate: PropTypes.oneOf([null, 'asc', 'desc'])
})

export const filtersShape = PropTypes.shape({
  genre: PropTypes.string,
  year: PropTypes.string,
  minRating: PropTypes.string
})

