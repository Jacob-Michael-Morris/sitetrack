import { Link } from 'react-router'

import './CSS/ErrorPage.css'

function NotFound() {
  return (
    <div className="error-page">
      <div className="error-card">
        <h1>Page Not Found</h1>

        <p>
          The page you are looking for does not exist.
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

export default NotFound