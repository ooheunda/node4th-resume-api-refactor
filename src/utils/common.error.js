export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotAuthorizedError";
  }
}

export class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidInputError";
  }
}
