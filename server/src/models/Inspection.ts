export interface InspectionInput {
  tool_id: number | string
  result: string
  condition: string
  notes?: string | null
  next_inspection_date?: string | null
}

export class InspectionDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InspectionDomainError'
  }
}

export class Inspection {
  static readonly VALID_RESULTS = [
    'Passed',
    'Failed'
  ]

  static readonly VALID_CONDITIONS = [
    'Good',
    'Fair',
    'Needs Repair',
    'Damaged'
  ]

  toolId: number
  result: string
  condition: string
  notes: string
  nextInspectionDate: string | null

  constructor(input: InspectionInput) {
    this.toolId = Number(input.tool_id)

    this.result = String(
      input.result ?? ''
    ).trim()

    this.condition = String(
      input.condition ?? ''
    ).trim()

    this.notes = String(
      input.notes ?? ''
    ).trim()

    this.nextInspectionDate =
      input.next_inspection_date
        ? String(
            input.next_inspection_date
          )
        : null

    this.validate()
  }

  isFailed() {
    return this.result === 'Failed'
  }

  private validate() {
    if (
      !Number.isInteger(this.toolId) ||
      this.toolId <= 0
    ) {
      throw new InspectionDomainError(
        'A valid tool is required'
      )
    }

    if (!this.result) {
      throw new InspectionDomainError(
        'Inspection result is required'
      )
    }

    if (
      !Inspection.VALID_RESULTS.includes(
        this.result
      )
    ) {
      throw new InspectionDomainError(
        'Invalid inspection result'
      )
    }

    if (!this.condition) {
      throw new InspectionDomainError(
        'Tool condition is required'
      )
    }

    if (
      !Inspection.VALID_CONDITIONS.includes(
        this.condition
      )
    ) {
      throw new InspectionDomainError(
        'Invalid tool condition'
      )
    }

    if (
      this.nextInspectionDate &&
      !this.isValidDate(
        this.nextInspectionDate
      )
    ) {
      throw new InspectionDomainError(
        'Next inspection date is invalid'
      )
    }
  }

  private isValidDate(value: string) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return false
    }

    const date = new Date(
      `${value}T00:00:00Z`
    )

    if (Number.isNaN(date.getTime())) {
      return false
    }

    return (
      date.toISOString().slice(0, 10) ===
      value
    )
  }
}