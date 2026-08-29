import { useEffect, useState } from 'react'

import { getAuditLogs } from '../services/audit-logs.service.js'

import type { AuditLog as AuditLogType } from '../types/AuditLog.js'

function AuditLog() {
  const [auditLogs, setAuditLogs] =
    useState<AuditLogType[]>([])

  const [search, setSearch] =
    useState('')

  const [error, setError] =
    useState('')

  useEffect(() => {
    let cancelled = false

    getAuditLogs()
      .then((data) => {
        if (!cancelled) {
          setAuditLogs(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Unable to load audit log.'
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredLogs =
    auditLogs.filter((log) => {
      const searchValue =
        search.toLowerCase()

      return (
        log.user_name
          ?.toLowerCase()
          .includes(searchValue) ||
        log.role_name
          ?.toLowerCase()
          .includes(searchValue) ||
        log.action
          .toLowerCase()
          .includes(searchValue) ||
        log.entity_type
          .toLowerCase()
          .includes(searchValue) ||
        log.description
          .toLowerCase()
          .includes(searchValue)
      )
    })

  function formatEntity(
    log: AuditLogType
  ) {
    if (log.entity_id === null) {
      return log.entity_type
    }

    return `${log.entity_type} #${log.entity_id}`
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Audit Log</h1>

          <p>
            Review important activity
            performed in SiteTrack.
          </p>
        </div>
      </div>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search audit log..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />
      </div>

      <div className="responsive-table-view">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Description</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map(
              (log) => (
                <tr
                  key={
                    log.audit_log_id
                  }
                >
                  <td>
                    {log.user_name ??
                      'System / Legacy'}
                  </td>

                  <td>
                    {log.role_name ??
                      'N/A'}
                  </td>

                  <td>
                    {log.action}
                  </td>

                  <td>
                    {formatEntity(log)}
                  </td>

                  <td>
                    {log.description}
                  </td>

                  <td>
                    {new Date(
                      log.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="mobile-card-list">
        {filteredLogs.map(
          (log) => (
            <article
              className="mobile-data-card"
              key={
                log.audit_log_id
              }
            >
              <div className="mobile-data-card-header">
                <div>
                  <h2>
                    {log.action}
                  </h2>
                </div>

                <span>
                  #{log.audit_log_id}
                </span>
              </div>

              <div className="mobile-data-card-body">
                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    User
                  </span>

                  <span>
                    {log.user_name ??
                      'System / Legacy'}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Role
                  </span>

                  <span>
                    {log.role_name ??
                      'N/A'}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Entity
                  </span>

                  <span>
                    {formatEntity(log)}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Timestamp
                  </span>

                  <span>
                    {new Date(
                      log.created_at
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="mobile-data-row">
                  <span className="mobile-data-label">
                    Description
                  </span>

                  <span>
                    {log.description}
                  </span>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {filteredLogs.length === 0 &&
        !error && (
          <p>
            No audit records found.
          </p>
        )}
    </div>
  )
}

export default AuditLog