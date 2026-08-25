import { useEffect, useState } from 'react'

import { getAuditLogs } from '../services/audit-logs.service.ts'

import type { AuditLog as AuditLogType } from '../types/AuditLog.js'

function AuditLog() {
  const [logs, setLogs] = useState<AuditLogType[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getAuditLogs()
      .then(setLogs)
      .catch(() => {
        setError('Unable to load audit logs.')
      })
  }, [])

  const filteredLogs = logs.filter((log) => {
    const searchValue = search.toLowerCase()

    return (
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
          <p>View important SiteTrack system activity.</p>
        </div>
      </div>

      {error && <p>{error}</p>}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search audit history..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Entity ID</th>
            <th>Description</th>
            <th>User</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.audit_log_id}>
              <td>
                {new Date(log.created_at).toLocaleString()}
              </td>
              <td>{log.action}</td>
              <td>{log.entity_type}</td>
              <td>{log.entity_id ?? 'N/A'}</td>
              <td>{log.description}</td>
              <td>{log.user_id ?? 'System'}</td>
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