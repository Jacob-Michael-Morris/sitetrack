import { useEffect, useState } from 'react'

import { getAuditLogs } from '../services/audit-logs.service.js'

import type { AuditLog as AuditLogType } from '../types/AuditLog.js'

function AuditLog() {
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

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
          setError('Unable to load audit log.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredLogs = auditLogs.filter((log) => {
    const searchValue = search.toLowerCase()

    return (
      log.user_name?.toLowerCase().includes(searchValue) ||
      log.role_name?.toLowerCase().includes(searchValue) ||
      log.action.toLowerCase().includes(searchValue) ||
      log.entity_type.toLowerCase().includes(searchValue) ||
      log.description.toLowerCase().includes(searchValue)
    )
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Audit Log</h1>
          <p>
            Review important activity performed in SiteTrack.
          </p>
        </div>
      </div>

      {error && <p>{error}</p>}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search audit log..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

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
          {filteredLogs.map((log) => (
            <tr key={log.audit_log_id}>
              <td>
                {log.user_name ?? 'System / Legacy'}
              </td>

              <td>
                {log.role_name ?? 'N/A'}
              </td>

              <td>
                {log.action}
              </td>

              <td>
                {log.entity_type}
                {log.entity_id !== null
                  ? ` #${log.entity_id}`
                  : ''}
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
          ))}
        </tbody>
      </table>

      {filteredLogs.length === 0 && !error && (
        <p>No audit records found.</p>
      )}
    </div>
  )
}

export default AuditLog