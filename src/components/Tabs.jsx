import PropTypes from 'prop-types'
import { tabs } from '../constants'

function Tabs({ activeTab, onTabChange }) {
  return (
    <div className="mb-6 border-b border-gray-700 overflow-x-auto">
      <nav className="flex space-x-1 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
  )
}

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
}

export default Tabs

