export interface CheckoutAssignmentInput {
  tool_id: number | string
  jobsite_id: number | string
  notes?: string | null
}

export interface ReturnAssignmentInput {
  tool_id: number | string
  notes?: string | null
}

export interface TransferAssignmentInput {
  tool_id: number | string
  jobsite_id: number | string
  notes?: string | null
}

export class AssignmentDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssignmentDomainError'
  }
}

export class ToolAssignment {
  static readonly CHECKED_OUT_STATUS =
    'Checked Out'

  static readonly RETURNED_STATUS =
    'Returned'

  static readonly TRANSFERRED_STATUS =
    'Transferred'

  toolId: number
  jobsiteId: number | null
  notes: string

  private constructor(
    toolId: number,
    jobsiteId: number | null,
    notes?: string | null
  ) {
    this.toolId = ToolAssignment.parseId(
      toolId,
      'tool'
    )

    this.jobsiteId =
      jobsiteId === null
        ? null
        : ToolAssignment.parseId(
            jobsiteId,
            'jobsite'
          )

    this.notes = String(
      notes ?? ''
    ).trim()
  }

  static forCheckout(
    input: CheckoutAssignmentInput
  ) {
    return new ToolAssignment(
      Number(input.tool_id),
      Number(input.jobsite_id),
      input.notes
    )
  }

  static forReturn(
    input: ReturnAssignmentInput
  ) {
    return new ToolAssignment(
      Number(input.tool_id),
      null,
      input.notes
    )
  }

  static forTransfer(
    input: TransferAssignmentInput
  ) {
    return new ToolAssignment(
      Number(input.tool_id),
      Number(input.jobsite_id),
      input.notes
    )
  }

  assertDifferentJobsite(
    currentJobsiteId: number
  ) {
    if (
      this.jobsiteId === currentJobsiteId
    ) {
      throw new AssignmentDomainError(
        'Tool is already assigned to this jobsite'
      )
    }
  }

  private static parseId(
    value: number,
    type: string
  ) {
    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      throw new AssignmentDomainError(
        `A valid ${type} ID is required`
      )
    }

    return value
  }
}