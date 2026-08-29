import { useState } from 'react'

import {
  NavLink,
  Outlet
} from 'react-router'

import Sidebar from './Sidebar'

import { useAuth } from '../context/useAuth.js'

import {
  ASSIGNMENT_ROLES,
  JOBSITE_ROLES,
  hasAllowedRole
} from '../constants/roles.js'

function Layout() {
  const [menuOpen, setMenuOpen] =
    useState(false)

  const { user } = useAuth()

  const role = user?.role

  const canViewJobsites =
    hasAllowedRole(
      role,
      JOBSITE_ROLES
    )

  const canViewAssignments =
    hasAllowedRole(
      role,
      ASSIGNMENT_ROLES
    )

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="app-layout">
      <Sidebar
        mobileOpen={menuOpen}
        onClose={closeMenu}
      />

      {menuOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}

      <div className="app-content-shell">
        <header className="mobile-header">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen(true)
            }
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>

          <span className="mobile-header-title">
            SiteTrack
          </span>
        </header>

        <main className="main-content">
          <Outlet />
        </main>

        <nav
          className="mobile-bottom-nav"
          aria-label="Quick navigation"
        >
          <NavLink
            to="/tools"
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14.5 6.5a4 4 0 0 0-5-5l2.2 2.2-2.8 2.8-2.2-2.2a4 4 0 0 0 5 5L19 16.6a2 2 0 1 1-2.8 2.8l-7.3-7.3" />
            </svg>

            <span>Tools</span>
          </NavLink>

          {canViewJobsites && (
            <NavLink
              to="/jobsites"
              onClick={closeMenu}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z" />

                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                />
              </svg>

              <span>Jobs</span>
            </NavLink>
          )}

          {canViewAssignments && (
            <NavLink
              to="/assignments"
              onClick={closeMenu}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7 7h11" />
                <path d="m15 4 3 3-3 3" />
                <path d="M17 17H6" />
                <path d="m9 14-3 3 3 3" />
              </svg>

              <span>
                Assignments
              </span>
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  )
}

export default Layout