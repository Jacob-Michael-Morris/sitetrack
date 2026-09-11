export interface AuditLogInput {
  user_id?: number | null
  action: string
  entity_type: string
  entity_id?: number | null
  description: string
}

export class AuditLogDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuditLogDomainError'
  }
}

export class AuditLog {
  userId: number | null
  action: string
  entityType: string
  entityId: number | null
  description: string

  constructor(input: AuditLogInput) {
    this.userId =
      input.user_id === null ||
      input.user_id === undefined
        ? null
        : Number(input.user_id)

    this.action = String(
      input.action ?? ''
    ).trim()

    this.entityType = String(
      input.entity_type ?? ''
    ).trim()

    this.entityId =
      input.entity_id === null ||
      input.entity_id === undefined
        ? null
        : Number(input.entity_id)

    this.description = String(
      input.description ?? ''
    ).trim()

    this.validate()
  }

  private validate() {
    if (
      this.userId !== null &&
      (
        !Number.isInteger(this.userId) ||
        this.userId <= 0
      )
    ) {
      throw new AuditLogDomainError(
        'Invalid audit user ID'
      )
    }

    if (!this.action) {
      throw new AuditLogDomainError(
        'Audit action is required'
      )
    }

    if (!this.entityType) {
      throw new AuditLogDomainError(
        'Audit entity type is required'
      )
    }

    if (
      this.entityId !== null &&
      (
        !Number.isInteger(this.entityId) ||
        this.entityId <= 0
      )
    ) {
      throw new AuditLogDomainError(
        'Invalid audit entity ID'
      )
    }

    if (!this.description) {
      throw new AuditLogDomainError(
        'Audit description is required'
      )
    }
  }
}