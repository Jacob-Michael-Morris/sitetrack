export interface JobsiteInput {
  name: string
  location: string
  status: string
  start_date?: string | null
  end_date?: string | null
  description?: string
}

export class Jobsite {
  static readonly VALID_STATUSES = [
    'Active',
    'Completed',
    'Inactive'
  ]

  name: string
  location: string
  status: string
  startDate: string | null
  endDate: string | null
  description: string

  constructor(input: JobsiteInput) {
    this.name = String(input.name ?? '').trim()

    this.location = String(
      input.location ?? ''
    ).trim()

    this.status = String(
      input.status ?? ''
    ).trim()

    this.startDate =
      input.start_date
        ? String(input.start_date)
        : null

    this.endDate =
      input.end_date
        ? String(input.end_date)
        : null

    this.description = String(
      input.description ?? ''
    ).trim()

    this.validate()
  }

  private validate() {
    if (!this.name) {
      throw new Error(
        'Jobsite name is required'
      )
    }

    if (!this.location) {
      throw new Error(
        'Jobsite location is required'
      )
    }

    if (
      !Jobsite.VALID_STATUSES.includes(
        this.status
      )
    ) {
      throw new Error(
        'Invalid jobsite status'
      )
    }

    if (
      this.startDate &&
      !this.isValidDate(this.startDate)
    ) {
      throw new Error(
        'Start date is invalid'
      )
    }

    if (
      this.endDate &&
      !this.isValidDate(this.endDate)
    ) {
      throw new Error(
        'End date is invalid'
      )
    }

    if (
      this.startDate &&
      this.endDate &&
      this.endDate < this.startDate
    ) {
      throw new Error(
        'End date cannot be before start date'
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