export interface DamageReportInput {
  tool_id: number | string
  inspection_id?: number | string | null
  description: string
  severity: string
  notes?: string | null
}

export class DamageReportDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DamageReportDomainError'
  }
}

export class DamageReport {
  static readonly VALID_SEVERITIES = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ]

  static readonly TOOL_STATUS =
    'Out of Service'

  static readonly TOOL_CONDITION =
    'Damaged'

  toolId: number
  inspectionId: number | null
  description: string
  severity: string
  notes: string

  constructor(input: DamageReportInput) {
    this.toolId =
      Number(input.tool_id)

    this.inspectionId =
      input.inspection_id === null ||
      input.inspection_id === undefined ||
      input.inspection_id === ''
        ? null
        : Number(input.inspection_id)

    this.description = String(
      input.description ?? ''
    ).trim()

    this.severity = String(
      input.severity ?? ''
    ).trim()

    this.notes = String(
      input.notes ?? ''
    ).trim()

    this.validate()
  }

  getAlertMessage() {
    return (
      'Tool damage was reported and ' +
      'the tool was removed from service.'
    )
  }

  getAuditDescription() {
    return (
      `Damage reported with severity: ` +
      `${this.severity}.`
    )
  }

  private validate() {
    if (
      !Number.isInteger(this.toolId) ||
      this.toolId <= 0
    ) {
      throw new DamageReportDomainError(
        'A valid tool is required'
      )
    }

    if (
      this.inspectionId !== null &&
      (
        !Number.isInteger(
          this.inspectionId
        ) ||
        this.inspectionId <= 0
      )
    ) {
      throw new DamageReportDomainError(
        'Invalid inspection ID'
      )
    }

    if (!this.description) {
      throw new DamageReportDomainError(
        'Damage description is required'
      )
    }

    if (!this.severity) {
      throw new DamageReportDomainError(
        'Damage severity is required'
      )
    }

    if (
      !DamageReport
        .VALID_SEVERITIES
        .includes(this.severity)
    ) {
      throw new DamageReportDomainError(
        'Invalid damage severity'
      )
    }
  }
}