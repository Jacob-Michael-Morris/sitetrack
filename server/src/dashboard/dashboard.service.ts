import pool from '../database/pool.js'

export class DashboardService {
  async getSummary() {
    const summaryResult = await pool.query(
      `SELECT
        (SELECT COUNT(*)::integer
         FROM tools) AS total_tools,

        (SELECT COUNT(*)::integer
         FROM tools
         WHERE status = 'Available') AS available_tools,

        (SELECT COUNT(*)::integer
         FROM tools
         WHERE status = 'Checked Out') AS checked_out_tools,

        (SELECT COUNT(*)::integer
         FROM tools
         WHERE status = 'Maintenance') AS maintenance_tools,

        (SELECT COUNT(*)::integer
         FROM tools
         WHERE status = 'Out of Service') AS out_of_service_tools,

        (SELECT COUNT(*)::integer
         FROM jobsites
         WHERE status = 'Active') AS active_jobsites,

        (SELECT COUNT(*)::integer
         FROM damage_reports
         WHERE status <> 'Resolved') AS open_damage_reports,

        (SELECT COUNT(*)::integer
         FROM work_orders
         WHERE status IN ('Open', 'Completed')) AS open_work_orders,

        (
          SELECT COUNT(*)::integer
          FROM inspections i
          WHERE i.next_inspection_date < CURRENT_DATE
            AND i.inspection_id = (
              SELECT i2.inspection_id
              FROM inspections i2
              WHERE i2.tool_id = i.tool_id
              ORDER BY
                i2.inspection_date DESC,
                i2.inspection_id DESC
              LIMIT 1
            )
        ) AS overdue_inspections,

        (SELECT COUNT(*)::integer
         FROM alerts
         WHERE is_read = FALSE) AS unread_alerts`
    )

    const alertsResult = await pool.query(
      `SELECT
         a.alert_id,
         a.tool_id,
         a.jobsite_id,
         a.alert_type,
         a.message,
         a.severity,
         a.is_read,
         a.created_at,
         t.name AS tool_name,
         j.name AS jobsite_name
       FROM alerts a
       LEFT JOIN tools t
         ON a.tool_id = t.tool_id
       LEFT JOIN jobsites j
         ON a.jobsite_id = j.jobsite_id
       ORDER BY a.created_at DESC
       LIMIT 5`
    )

    return {
      summary: summaryResult.rows[0],
      recent_alerts: alertsResult.rows
    }
  }
}

export const dashboardService =
  new DashboardService()