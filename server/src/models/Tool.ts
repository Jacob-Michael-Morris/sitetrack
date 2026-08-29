import {
  ValidationError
} from '../errors/ValidationError.js'

export interface ToolInput {
  name: string
  serial_number: string
  category: string
  status?: string
  condition?: string
  purchase_date?: string | null
}

export class Tool {
  static readonly VALID_STATUSES = [
    'Available',
    'Checked Out',
    'Maintenance',
    'Out of Service'
  ]

  static readonly VALID_CONDITIONS = [
    'Good',
    'Fair',
    'Needs Repair',
    'Damaged'
  ]

  name: string
  serialNumber: string
  category: string
  status: string
  condition: string
  purchaseDate: string | null

  constructor(input: ToolInput) {
    this.name = String(
      input.name ?? ''
    ).trim()

    this.serialNumber = String(
      input.serial_number ?? ''
    ).trim()

    this.category = String(
      input.category ?? ''
    ).trim()

    this.status = String(
      input.status ?? 'Available'
    ).trim()

    this.condition = String(
      input.condition ?? 'Good'
    ).trim()

    this.purchaseDate =
      input.purchase_date
        ? String(input.purchase_date)
        : null

    this.validate()
  }

  private validate() {
    if (!this.name) {
      throw new ValidationError(
        'Tool name is required'
      )
    }

    if (!this.serialNumber) {
      throw new ValidationError(
        'Serial number is required'
      )
    }

    if (!this.category) {
      throw new ValidationError(
        'Category is required'
      )
    }

    if (
      !Tool.VALID_STATUSES.includes(
        this.status
      )
    ) {
      throw new ValidationError(
        'Invalid tool status'
      )
    }

    if (
      !Tool.VALID_CONDITIONS.includes(
        this.condition
      )
    ) {
      throw new ValidationError(
        'Invalid tool condition'
      )
    }

    if (
      this.purchaseDate &&
      !this.isValidDate(
        this.purchaseDate
      )
    ) {
      throw new ValidationError(
        'Purchase date is invalid'
      )
    }

    if (
      this.purchaseDate &&
      this.isFutureDate(
        this.purchaseDate
      )
    ) {
      throw new ValidationError(
        'Purchase date cannot be in the future'
      )
    }
  }

  private isValidDate(
    value: string
  ) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        value
      )
    ) {
      return false
    }

    const date = new Date(
      `${value}T00:00:00Z`
    )

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return false
    }

    return (
      date
        .toISOString()
        .slice(0, 10) === value
    )
  }

  private isFutureDate(
    value: string
  ) {
    const selectedDate =
      new Date(
        `${value}T00:00:00`
      )

    const today = new Date()

    today.setHours(
      0,
      0,
      0,
      0
    )

    return selectedDate > today
  }
}