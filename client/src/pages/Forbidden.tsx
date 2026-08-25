import { Link } from 'react-router'

import './CSS/ErrorPage.css'

function Forbidden() {
  return (
    <div className="error-page">
      <div className="error-card">
        <h1>Access Denied</h1>

        <p>
          You do not have permission to access this
          part of SiteTrack.
        </p>

        <Link
          className="error-page-button"
          to="/dashboard"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Forbidden