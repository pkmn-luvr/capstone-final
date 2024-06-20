"use strict";

class ExpressError extends Error {
  constructor(message, status, code = "GENERIC", method, url) {
    super(message);
    this.status = status;
    this.code = code;
    this.method = method;
    this.url = url;
    this.timestamp = new Date().toISOString();
  }

  logDetailedInfo() {
    console.error(`Error occurred at ${this.timestamp}:
      Status: ${this.status}
      Message: ${this.message}
      Code: ${this.code}
      Method: ${this.method}
      URL: ${this.url}
      Stack: ${this.stack}`);
  }

  toString() {
    return `${this.status} - ${this.message}`;
  }
}

class NotFoundError extends ExpressError {
  constructor(message = "Not Found", method, url) {
    super(message, 404, "NOT_FOUND", method, url);
  }
}

class UnauthorizedError extends ExpressError {
  constructor(message = "Unauthorized", method, url) {
    super(message, 401, "UNAUTHORIZED", method, url);
  }
}

class BadRequestError extends ExpressError {
  constructor(message = "Bad Request", method, url) {
    super(message, 400, "BAD_REQUEST", method, url);
  }
}

class ForbiddenError extends ExpressError {
  constructor(message = "Forbidden", method, url) {
    super(message, 403, "FORBIDDEN", method, url);
  }
}

class InternalServerError extends ExpressError {
  constructor(message = "Internal Server Error", method, url) {
    super(message, 500, "INTERNAL_SERVER_ERROR", method, url);
  }
}

export {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
  InternalServerError
};
