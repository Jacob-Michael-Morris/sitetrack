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
    this.name = input.name.trim()
    this.serialNumber = input.serial_number.trim()
    this.category = input.category.trim()

    this.status =
      input.status ?? 'Available'

    this.condition =
      input.condition ?? 'Good'

    this.purchaseDate =
      input.purchase_date || null

    this.validate()
  }

  private validate() {
    if (!this.name) {
      throw new Error('Tool name is required')
    }

    if (!this.serialNumber) {
      throw new Error('Serial number is required')
    }

    if (!this.category) {
      throw new Error('Category is required')
    }

    if (
      !Tool.VALID_STATUSES.includes(this.status)
    ) {
      throw new Error('Invalid tool status')
    }

    if (
      !Tool.VALID_CONDITIONS.includes(
        this.condition
      )
    ) {
      throw new Error('Invalid tool condition')
    }

    if (
      this.purchaseDate &&
      this.isFutureDate(this.purchaseDate)
    ) {
      throw new Error(
        'Purchase date cannot be in the future'
      )
    }
  }

  private isFutureDate(value: string) {
    const selectedDate = new Date(
      `${value}T00:00:00`
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return selectedDate > today
  }
}