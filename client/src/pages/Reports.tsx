import { useEffect, useState } from 'react'

import { useAuth } from '../context/useAuth.js'

import {
  getCurrentAssignmentsReport,
  getDamageHistoryReport,
  getInspectionStatusReport,
  getMaintenanceHistoryReport,
  getToolInventoryReport
} from '../services/reports.service.js'

import { exportCsv } from '../utils/csv.js'

import type {
  AssignmentReport,
  DamageReport,
  InspectionReport,
  MaintenanceReport,
  ReportType,
  ToolInventoryReport
} from '../types/Report.js'

import './CSS/Reports.css'

type ReportData =
  | ToolInventoryReport[]
  | AssignmentReport[]
  | MaintenanceReport[]
  | InspectionReport[]
  | DamageReport[]

function Reports() {
  const { user } = useAuth()

  const [reportType, setReportType] =
    useState<ReportType>('tool-inventory')

  const [data, setData] =
    useState<ReportData>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const role = user?.role

  const isAdministrator =
    role === 'Administrator'

  const isEquipmentManager =
    role === 'Equipment Manager'

  const isMaintenanceTechnician =
    role === 'Maintenance Technician'

  const isSafetyPersonnel =
    role === 'Safety Personnel'

  useEffect(() => {
    let cancelled = false

    let request: Promise<ReportData>

    switch (reportType) {
      case 'current-assignments':
        request = getCurrentAssignmentsReport()
        break

      case 'maintenance-history':
        request = getMaintenanceHistoryReport()
        break

      case 'inspection-status':
        request = getInspectionStatusReport()
        break

      case 'damage-history':
        request = getDamageHistoryReport()
        break

      default:
        request = getToolInventoryReport()
    }

    request
      .then((reportData) => {
        if (!cancelled) {
          setData(reportData)
          setError('')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData([])
          setError('Unable to load report.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [reportType])

  function handleReportChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setLoading(true)

    setReportType(
      event.target.value as ReportType
    )
  }

  function formatDate(
    value: string | null
  ) {
    if (!value) {
      return 'N/A'
    }

    return new Date(value).toLocaleString()
  }

  function getExportDate() {
    return new Date()
      .toISOString()
      .slice(0, 10)
  }

  function handleExport() {
    if (data.length === 0) {
      return
    }

    const date = getExportDate()

    if (reportType === 'tool-inventory') {
      const rows =
        data as ToolInventoryReport[]

      exportCsv(
        `sitetrack-tool-inventory-${date}.csv`,
        [
          'Tool ID',
          'Tool',
          'Serial Number',
          'Category',
          'Status',
          'Condition',
          'Purchase Date',
          'Current Jobsite'
        ],
        rows.map((row) => [
          row.tool_id,
          row.name,
          row.serial_number,
          row.category,
          row.status,
          row.condition,
          row.purchase_date
            ? formatDate(row.purchase_date)
            : 'N/A',
          row.current_jobsite ?? 'N/A'
        ])
      )

      return
    }

    if (reportType === 'current-assignments') {
      const rows =
        data as AssignmentReport[]

      exportCsv(
        `sitetrack-current-assignments-${date}.csv`,
        [
          'Assignment ID',
          'Tool',
          'Serial Number',
          'Jobsite',
          'Assigned',
          'Status',
          'Notes'
        ],
        rows.map((row) => [
          row.assignment_id,
          row.tool_name,
          row.serial_number,
          row.jobsite_name,
          formatDate(row.assigned_at),
          row.status,
          row.notes ?? 'N/A'
        ])
      )

      return
    }

    if (reportType === 'maintenance-history') {
      const rows =
        data as MaintenanceReport[]

      exportCsv(
        `sitetrack-maintenance-history-${date}.csv`,
        [
          'Work Order',
          'Tool',
          'Serial Number',
          'Damage Report',
          'Description',
          'Priority',
          'Status',
          'Assigned To',
          'Opened',
          'Completed',
          'Notes'
        ],
        rows.map((row) => [
          row.work_order_id,
          row.tool_name,
          row.serial_number,
          row.damage_report_id ?? 'N/A',
          row.description,
          row.priority,
          row.status,
          row.assigned_to || 'Unassigned',
          formatDate(row.opened_at),
          formatDate(row.completed_at),
          row.notes ?? 'N/A'
        ])
      )

      return
    }

    if (reportType === 'inspection-status') {
      const rows =
        data as InspectionReport[]

      exportCsv(
        `sitetrack-inspection-status-${date}.csv`,
        [
          'Tool ID',
          'Tool',
          'Serial Number',
          'Inspection ID',
          'Last Inspection',
          'Result',
          'Condition',
          'Next Inspection',
          'Inspection Status'
        ],
        rows.map((row) => [
          row.tool_id,
          row.tool_name,
          row.serial_number,
          row.inspection_id ?? 'N/A',
          formatDate(row.inspection_date),
          row.result ?? 'N/A',
          row.condition ?? 'N/A',
          formatDate(
            row.next_inspection_date
          ),
          row.inspection_status
        ])
      )

      return
    }

    const rows =
      data as DamageReport[]

    exportCsv(
      `sitetrack-damage-history-${date}.csv`,
      [
        'Damage Report',
        'Tool',
        'Serial Number',
        'Inspection ID',
        'Description',
        'Severity',
        'Status',
        'Reported',
        'Resolved',
        'Notes'
      ],
      rows.map((row) => [
        row.damage_report_id,
        row.tool_name,
        row.serial_number,
        row.inspection_id ?? 'N/A',
        row.description,
        row.severity,
        row.status,
        formatDate(row.reported_at),
        formatDate(row.resolved_at),
        row.notes ?? 'N/A'
      ])
    )
  }

  function renderReport() {
    if (loading) {
      return <p>Loading report...</p>
    }

    if (error) {
      return <p>{error}</p>
    }

    if (reportType === 'tool-inventory') {
      const rows =
        data as ToolInventoryReport[]

      return (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Serial Number</th>
              <th>Category</th>
              <th>Status</th>
              <th>Condition</th>
              <th>Current Jobsite</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.tool_id}>
                <td>{row.name}</td>
                <td>{row.serial_number}</td>
                <td>{row.category}</td>
                <td>{row.status}</td>
                <td>{row.condition}</td>
                <td>
                  {row.current_jobsite ?? 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (reportType === 'current-assignments') {
      const rows =
        data as AssignmentReport[]

      return (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Serial Number</th>
              <th>Jobsite</th>
              <th>Assigned</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.assignment_id}>
                <td>{row.tool_name}</td>
                <td>{row.serial_number}</td>
                <td>{row.jobsite_name}</td>
                <td>
                  {formatDate(row.assigned_at)}
                </td>
                <td>{row.status}</td>
                <td>{row.notes || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (reportType === 'maintenance-history') {
      const rows =
        data as MaintenanceReport[]

      return (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Work Order</th>
              <th>Tool</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Opened</th>
              <th>Completed</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.work_order_id}>
                <td>#{row.work_order_id}</td>
                <td>{row.tool_name}</td>
                <td>{row.priority}</td>
                <td>{row.status}</td>
                <td>
                  {row.assigned_to || 'Unassigned'}
                </td>
                <td>
                  {formatDate(row.opened_at)}
                </td>
                <td>
                  {formatDate(row.completed_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (reportType === 'inspection-status') {
      const rows =
        data as InspectionReport[]

      return (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Serial Number</th>
              <th>Last Inspection</th>
              <th>Result</th>
              <th>Condition</th>
              <th>Next Inspection</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.tool_id}>
                <td>{row.tool_name}</td>
                <td>{row.serial_number}</td>
                <td>
                  {formatDate(
                    row.inspection_date
                  )}
                </td>
                <td>{row.result ?? 'N/A'}</td>
                <td>
                  {row.condition ?? 'N/A'}
                </td>
                <td>
                  {formatDate(
                    row.next_inspection_date
                  )}
                </td>
                <td>
                  {row.inspection_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    const rows =
      data as DamageReport[]

    return (
      <table className="reports-table">
        <thead>
          <tr>
            <th>Report</th>
            <th>Tool</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Description</th>
            <th>Reported</th>
            <th>Resolved</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.damage_report_id}>
              <td>#{row.damage_report_id}</td>
              <td>{row.tool_name}</td>
              <td>{row.severity}</td>
              <td>{row.status}</td>
              <td>{row.description}</td>
              <td>
                {formatDate(row.reported_at)}
              </td>
              <td>
                {formatDate(row.resolved_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="reports-page">
      <div>
        <h1>Reports</h1>

        <p>
          View and export current and historical
          SiteTrack information.
        </p>
      </div>

      <div className="reports-toolbar">
        <label>
          Report

          <select
            value={reportType}
            onChange={handleReportChange}
          >
            <option value="tool-inventory">
              Tool Inventory
            </option>

            {(isAdministrator ||
              isEquipmentManager) && (
              <option value="current-assignments">
                Current Assignments
              </option>
            )}

            {(isAdministrator ||
              isEquipmentManager ||
              isMaintenanceTechnician) && (
              <option value="maintenance-history">
                Maintenance History
              </option>
            )}

            {(isAdministrator ||
              isEquipmentManager ||
              isMaintenanceTechnician ||
              isSafetyPersonnel) && (
              <option value="inspection-status">
                Inspection Status
              </option>
            )}

            {(isAdministrator ||
              isEquipmentManager ||
              isMaintenanceTechnician ||
              isSafetyPersonnel) && (
              <option value="damage-history">
                Damage History
              </option>
            )}
          </select>
        </label>

        <button
          className="reports-export-button"
          type="button"
          onClick={handleExport}
          disabled={
            loading ||
            Boolean(error) ||
            data.length === 0
          }
        >
          Export CSV
        </button>
      </div>

      <div className="reports-table-container">
        {renderReport()}
      </div>
    </div>
  )
}

export default Reports