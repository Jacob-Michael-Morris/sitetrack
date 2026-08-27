export interface AlertInput {
  tool_id?: number | string | null
  jobsite_id?: number | string | null
  alert_type: string
  message: string
  severity: string
}

export class AlertDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AlertDomainError'
  }
}

export class Alert {
  static readonly VALID_SEVERITIES = [
    'Info',
    'Warning',
    'Low',
    'Medium',
    'High',
    'Critical'
  ]

  toolId: number | null
  jobsiteId: number | null
  alertType: string
  message: string
  severity: string

  constructor(input: AlertInput) {
    this.toolId = this.parseOptionalId(
      input.tool_id,
      'tool'
    )

    this.jobsiteId = this.parseOptionalId(
      input.jobsite_id,
      'jobsite'
    )

    this.alertType = String(
      input.alert_type ?? ''
    ).trim()

    this.message = String(
      input.message ?? ''
    ).trim()

    this.severity = String(
      input.severity ?? ''
    ).trim()

    this.validate()
  }

  private validate() {
    if (!this.alertType) {
      throw new AlertDomainError(
        'Alert type is required'
      )
    }

    if (!this.message) {
      throw new AlertDomainError(
        'Alert message is required'
      )
    }

    if (!this.severity) {
      throw new AlertDomainError(
        'Alert severity is required'
      )
    }

    if (
      !Alert.VALID_SEVERITIES.includes(
        this.severity
      )
    ) {
      throw new AlertDomainError(
        'Invalid alert severity'
      )
    }
  }

  private parseOptionalId(
    value: number | string | null | undefined,
    type: string
  ) {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return null
    }

    const id = Number(value)

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new AlertDomainError(
        `Invalid ${type} ID`
      )
    }

    return id
  }
}