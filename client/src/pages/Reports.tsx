import { useEffect, useState } from 'react'

import StatusBadge from '../components/StatusBadge.js'
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

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

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
        request =
          getCurrentAssignmentsReport()
        break

      case 'maintenance-history':
        request =
          getMaintenanceHistoryReport()
        break

      case 'inspection-status':
        request =
          getInspectionStatusReport()
        break

      case 'damage-history':
        request =
          getDamageHistoryReport()
        break

      default:
        request =
          getToolInventoryReport()
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

          setError(
            'Unable to load report.'
          )
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
    event:
      React.ChangeEvent<HTMLSelectElement>
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

    return new Date(
      value
    ).toLocaleString()
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

    if (
      reportType ===
      'tool-inventory'
    ) {
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
            ? formatDate(
                row.purchase_date
              )
            : 'N/A',
          row.current_jobsite ??
            'N/A'
        ])
      )

      return
    }

    if (
      reportType ===
      'current-assignments'
    ) {
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
          formatDate(
            row.assigned_at
          ),
          row.status,
          row.notes ?? 'N/A'
        ])
      )

      return
    }

    if (
      reportType ===
      'maintenance-history'
    ) {
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
          row.damage_report_id ??
            'N/A',
          row.description,
          row.priority,
          row.status,
          row.assigned_to ||
            'Unassigned',
          formatDate(
            row.opened_at
          ),
          formatDate(
            row.completed_at
          ),
          row.notes ?? 'N/A'
        ])
      )

      return
    }

    if (
      reportType ===
      'inspection-status'
    ) {
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
          row.inspection_id ??
            'N/A',
          formatDate(
            row.inspection_date
          ),
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
        row.inspection_id ??
          'N/A',
        row.description,
        row.severity,
        row.status,
        formatDate(
          row.reported_at
        ),
        formatDate(
          row.resolved_at
        ),
        row.notes ?? 'N/A'
      ])
    )
  }

  function renderDesktopReport() {
    if (
      reportType ===
      'tool-inventory'
    ) {
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
              <th>
                Current Jobsite
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.tool_id}>
                <td>{row.name}</td>

                <td>
                  {row.serial_number}
                </td>

                <td>
                  {row.category}
                </td>

                <td>
                  <StatusBadge
                    value={row.status}
                  />
                </td>

                <td>
                  <StatusBadge
                    value={
                      row.condition
                    }
                  />
                </td>

                <td>
                  {row.current_jobsite ??
                    'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (
      reportType ===
      'current-assignments'
    ) {
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
              <tr
                key={
                  row.assignment_id
                }
              >
                <td>
                  {row.tool_name}
                </td>

                <td>
                  {row.serial_number}
                </td>

                <td>
                  {row.jobsite_name}
                </td>

                <td>
                  {formatDate(
                    row.assigned_at
                  )}
                </td>

                <td>
                  <StatusBadge
                    value={row.status}
                  />
                </td>

                <td>
                  {row.notes ||
                    'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (
      reportType ===
      'maintenance-history'
    ) {
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
              <tr
                key={
                  row.work_order_id
                }
              >
                <td>
                  #{row.work_order_id}
                </td>

                <td>
                  {row.tool_name}
                </td>

                <td>
                  <StatusBadge
                    value={
                      row.priority
                    }
                  />
                </td>

                <td>
                  <StatusBadge
                    value={row.status}
                  />
                </td>

                <td>
                  {row.assigned_to ||
                    'Unassigned'}
                </td>

                <td>
                  {formatDate(
                    row.opened_at
                  )}
                </td>

                <td>
                  {formatDate(
                    row.completed_at
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    if (
      reportType ===
      'inspection-status'
    ) {
      const rows =
        data as InspectionReport[]

      return (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Serial Number</th>
              <th>
                Last Inspection
              </th>
              <th>Result</th>
              <th>Condition</th>
              <th>
                Next Inspection
              </th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.tool_id}>
                <td>
                  {row.tool_name}
                </td>

                <td>
                  {row.serial_number}
                </td>

                <td>
                  {formatDate(
                    row.inspection_date
                  )}
                </td>

                <td>
                  {row.result ? (
                    <StatusBadge
                      value={
                        row.result
                      }
                    />
                  ) : (
                    'N/A'
                  )}
                </td>

                <td>
                  {row.condition ? (
                    <StatusBadge
                      value={
                        row.condition
                      }
                    />
                  ) : (
                    'N/A'
                  )}
                </td>

                <td>
                  {formatDate(
                    row.next_inspection_date
                  )}
                </td>

                <td>
                  <StatusBadge
                    value={
                      row.inspection_status
                    }
                  />
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
            <tr
              key={
                row.damage_report_id
              }
            >
              <td>
                #{row.damage_report_id}
              </td>

              <td>
                {row.tool_name}
              </td>

              <td>
                <StatusBadge
                  value={
                    row.severity
                  }
                />
              </td>

              <td>
                <StatusBadge
                  value={row.status}
                />
              </td>

              <td>
                {row.description}
              </td>

              <td>
                {formatDate(
                  row.reported_at
                )}
              </td>

              <td>
                {formatDate(
                  row.resolved_at
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  function renderMobileReport() {
    if (
      reportType ===
      'tool-inventory'
    ) {
      const rows =
        data as ToolInventoryReport[]

      return rows.map((row) => (
        <article
          className="report-mobile-card"
          key={row.tool_id}
        >
          <div className="report-mobile-card-header">
            <div>
              <h2>{row.name}</h2>

              <span>
                {row.serial_number}
              </span>
            </div>

            <StatusBadge
              value={row.status}
            />
          </div>

          <div className="report-mobile-card-body">
            <div className="report-mobile-row">
              <span>Category</span>
              <strong>
                {row.category}
              </strong>
            </div>

            <div className="report-mobile-row">
              <span>Status</span>

              <StatusBadge
                value={row.status}
              />
            </div>

            <div className="report-mobile-row">
              <span>Condition</span>

              <StatusBadge
                value={
                  row.condition
                }
              />
            </div>

            <div className="report-mobile-row">
              <span>
                Current Jobsite
              </span>

              <strong>
                {row.current_jobsite ??
                  'N/A'}
              </strong>
            </div>
          </div>
        </article>
      ))
    }

    if (
      reportType ===
      'current-assignments'
    ) {
      const rows =
        data as AssignmentReport[]

      return rows.map((row) => (
        <article
          className="report-mobile-card"
          key={row.assignment_id}
        >
          <div className="report-mobile-card-header">
            <div>
              <h2>
                {row.tool_name}
              </h2>

              <span>
                {row.serial_number}
              </span>
            </div>

            <StatusBadge
              value={row.status}
            />
          </div>

          <div className="report-mobile-card-body">
            <div className="report-mobile-row">
              <span>Jobsite</span>

              <strong>
                {row.jobsite_name}
              </strong>
            </div>

            <div className="report-mobile-row">
              <span>Assigned</span>

              <strong>
                {formatDate(
                  row.assigned_at
                )}
              </strong>
            </div>

            <div className="report-mobile-row">
              <span>Status</span>

              <StatusBadge
                value={row.status}
              />
            </div>

            <div className="report-mobile-row report-mobile-row-stacked">
              <span>Notes</span>

              <strong>
                {row.notes ||
                  'N/A'}
              </strong>
            </div>
          </div>
        </article>
      ))
    }

    if (
      reportType ===
      'maintenance-history'
    ) {
      const rows =
        data as MaintenanceReport[]

      return rows.map((row) => (
        <article
          className="report-mobile-card"
          key={row.work_order_id}
        >
          <div className="report-mobile-card-header">
            <div>
              <h2>
                {row.tool_name}
              </h2>

              <span>
                Work Order #
                {row.work_order_id}
              </span>
            </div>

            <StatusBadge
              value={row.priority}
            />
          </div>

          <div className="report-mobile-card-body">
            <div className="report-mobile-row">
              <span>Status</span>

              <StatusBadge
                value={row.status}
              />
            </div>

            <div className="report-mobile-row">
              <span>
                Assigned To
              </span>

              <strong>
                {row.assigned_to ||
                  'Unassigned'}
              </strong>
            </div>

            <div className="report-mobile-row">
              <span>Opened</span>

              <strong>
                {formatDate(
                  row.opened_at
                )}
              </strong>
            </div>

            <div className="report-mobile-row">
              <span>Completed</span>

              <strong>
                {formatDate(
                  row.completed_at
                )}
              </strong>
            </div>
          </div>
        </article>
      ))
    }

    if (
      reportType ===
      'inspection-status'
    ) {
      const rows =
        data as InspectionReport[]

      return rows.map((row) => (
        <article
          className="report-mobile-card"
          key={row.tool_id}
        >
          <div className="report-mobile-card-header">
            <div>
              <h2>
                {row.tool_name}
              </h2>

              <span>
                {row.serial_number}
              </span>
            </div>

            <StatusBadge
              value={
                row.inspection_status
              }
            />
          </div>

          <div className="report-mobile-card-body">
            <div className="report-mobile-row">
              <span>
                Last Inspection
              </span>

              <strong>
                {formatDate(
                  row.inspection_date
                )}
              </strong>
            </div>

            <div className="report-mobile-row">
              <span>Result</span>

              {row.result ? (
                <StatusBadge
                  value={row.result}
                />
              ) : (
                <strong>N/A</strong>
              )}
            </div>

            <div className="report-mobile-row">
              <span>Condition</span>

              {row.condition ? (
                <StatusBadge
                  value={
                    row.condition
                  }
                />
              ) : (
                <strong>N/A</strong>
              )}
            </div>

            <div className="report-mobile-row">
              <span>
                Next Inspection
              </span>

              <strong>
                {formatDate(
                  row.next_inspection_date
                )}
              </strong>
            </div>
          </div>
        </article>
      ))
    }

    const rows =
      data as DamageReport[]

    return rows.map((row) => (
      <article
        className="report-mobile-card"
        key={row.damage_report_id}
      >
        <div className="report-mobile-card-header">
          <div>
            <h2>
              {row.tool_name}
            </h2>

            <span>
              Damage Report #
              {row.damage_report_id}
            </span>
          </div>

          <StatusBadge
            value={row.severity}
          />
        </div>

        <div className="report-mobile-card-body">
          <div className="report-mobile-row">
            <span>Status</span>

            <StatusBadge
              value={row.status}
            />
          </div>

          <div className="report-mobile-row">
            <span>Reported</span>

            <strong>
              {formatDate(
                row.reported_at
              )}
            </strong>
          </div>

          <div className="report-mobile-row">
            <span>Resolved</span>

            <strong>
              {formatDate(
                row.resolved_at
              )}
            </strong>
          </div>

          <div className="report-mobile-row report-mobile-row-stacked">
            <span>Description</span>

            <strong>
              {row.description}
            </strong>
          </div>
        </div>
      </article>
    ))
  }

  return (
    <div className="reports-page">
      <div>
        <h1>Reports</h1>

        <p>
          View and export current and
          historical SiteTrack
          information.
        </p>
      </div>

      <div className="reports-toolbar">
        <label>
          Report

          <select
            value={reportType}
            onChange={
              handleReportChange
            }
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

      {loading && (
        <p>Loading report...</p>
      )}

      {!loading && error && (
        <p role="alert">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        data.length === 0 && (
          <p>
            No records found for this
            report.
          </p>
        )}

      {!loading &&
        !error &&
        data.length > 0 && (
          <>
            <div className="reports-table-container">
              {renderDesktopReport()}
            </div>

            <div className="reports-mobile-cards">
              {renderMobileReport()}
            </div>
          </>
        )}
    </div>
  )
}

export default Reports