export interface CreateUserInput {
  name: string
  email: string
  password: string
  role_id: number
}

export interface UpdateUserInput {
  name: string
  email: string
  role_id: number
  is_active: boolean
}

export class UserDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserDomainError'
  }
}

export class User {
  name: string
  email: string
  roleId: number
  password: string | null
  isActive: boolean

  private constructor(input: {
    name: string
    email: string
    role_id: number
    password?: string | null
    is_active?: boolean
  }) {
    this.name = String(input.name ?? '').trim()

    this.email = String(input.email ?? '')
      .trim()
      .toLowerCase()

    this.roleId = Number(input.role_id)

    this.password =
      input.password !== undefined &&
      input.password !== null
        ? String(input.password)
        : null

    this.isActive =
      input.is_active ?? true

    this.validateCommon()
  }

  static forCreate(
    input: CreateUserInput
  ) {
    const user = new User({
      ...input,
      is_active: true
    })

    user.validatePassword()

    return user
  }

  static forUpdate(
    input: UpdateUserInput
  ) {
    const user = new User(input)

    if (typeof input.is_active !== 'boolean') {
      throw new UserDomainError(
        'Account status is required'
      )
    }

    return user
  }

  assertCanBeUpdatedBy(
    targetUserId: number,
    actorUserId: number
  ) {
    if (
      targetUserId === actorUserId &&
      this.isActive === false
    ) {
      throw new UserDomainError(
        'You cannot deactivate your own account'
      )
    }
  }

  private validateCommon() {
    if (!this.name) {
      throw new UserDomainError(
        'Name is required'
      )
    }

    if (!this.email) {
      throw new UserDomainError(
        'Email is required'
      )
    }

    if (!this.isValidEmail()) {
      throw new UserDomainError(
        'Enter a valid email address'
      )
    }

    if (
      !Number.isInteger(this.roleId) ||
      this.roleId <= 0
    ) {
      throw new UserDomainError(
        'A valid role is required'
      )
    }
  }

  private validatePassword() {
    if (!this.password) {
      throw new UserDomainError(
        'Password is required'
      )
    }

    if (this.password.length < 8) {
      throw new UserDomainError(
        'Password must be at least 8 characters long'
      )
    }
  }

  private isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      this.email
    )
  }
}