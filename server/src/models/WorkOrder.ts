export interface WorkOrderInput {
  tool_id: number | string
  damage_report_id?: number | string | null
  description: string
  priority?: string
  assigned_to?: string | null
  notes?: string | null
}

export class WorkOrderDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkOrderDomainError'
  }
}

export class WorkOrder {
  static readonly VALID_PRIORITIES = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ]

  static readonly OPEN_STATUS = 'Open'
  static readonly COMPLETED_STATUS = 'Completed'
  static readonly AWAITING_APPROVAL_STATUS =
    'Awaiting Approval'
  static readonly CLOSED_STATUS = 'Closed'

  static readonly MAINTENANCE_STATUS =
    'Maintenance'

  static readonly AVAILABLE_STATUS =
    'Available'

  static readonly GOOD_CONDITION =
    'Good'

  toolId: number
  damageReportId: number | null
  description: string
  priority: string
  assignedTo: string
  notes: string

  constructor(input: WorkOrderInput) {
    this.toolId = Number(input.tool_id)

    this.damageReportId =
      input.damage_report_id === null ||
      input.damage_report_id === undefined ||
      input.damage_report_id === ''
        ? null
        : Number(input.damage_report_id)

    this.description = String(
      input.description ?? ''
    ).trim()

    this.priority = String(
      input.priority ?? 'Medium'
    ).trim()

    this.assignedTo = String(
      input.assigned_to ?? ''
    ).trim()

    this.notes = String(
      input.notes ?? ''
    ).trim()

    this.validate()
  }

  static assertCanComplete(
    currentStatus: string
  ) {
    if (
      currentStatus !== WorkOrder.OPEN_STATUS
    ) {
      throw new WorkOrderDomainError(
        'Only open work orders can be completed'
      )
    }
  }

  static assertCanRequestReturnToService(
    currentStatus: string
  ) {
    if (
      currentStatus !==
      WorkOrder.COMPLETED_STATUS
    ) {
      throw new WorkOrderDomainError(
        'Work order must be completed before return-to-service review can be requested'
      )
    }
  }

  static assertCanDecideReturnToService(
    currentStatus: string
  ) {
    if (
      currentStatus !==
      WorkOrder.AWAITING_APPROVAL_STATUS
    ) {
      throw new WorkOrderDomainError(
        'A return-to-service request must be pending before a decision is recorded'
      )
    }
  }

  getCreationAlertMessage() {
    return (
      'A maintenance work order was created ' +
      'for this tool.'
    )
  }

  getCreationAuditDescription(
    workOrderId: number
  ) {
    return (
      `Maintenance work order #${workOrderId} ` +
      'was created.'
    )
  }

  static getCompletionAuditDescription(
    workOrderId: number
  ) {
    return (
      `Maintenance work order #${workOrderId} ` +
      'was completed.'
    )
  }

  static getReturnToServiceMessage() {
    return (
      'Maintenance is complete and the tool ' +
      'has been returned to service.'
    )
  }

  static getReturnToServiceAuditDescription(
    workOrderId: number
  ) {
    return (
      `Work order #${workOrderId} was closed ` +
      'and the tool was returned to service.'
    )
  }

  private validate() {
    if (
      !Number.isInteger(this.toolId) ||
      this.toolId <= 0
    ) {
      throw new WorkOrderDomainError(
        'A valid tool is required'
      )
    }

    if (
      this.damageReportId !== null &&
      (
        !Number.isInteger(
          this.damageReportId
        ) ||
        this.damageReportId <= 0
      )
    ) {
      throw new WorkOrderDomainError(
        'Invalid damage report ID'
      )
    }

    if (!this.description) {
      throw new WorkOrderDomainError(
        'Work order description is required'
      )
    }

    if (
      !WorkOrder.VALID_PRIORITIES.includes(
        this.priority
      )
    ) {
      throw new WorkOrderDomainError(
        'Invalid work order priority'
      )
    }
  }
}
