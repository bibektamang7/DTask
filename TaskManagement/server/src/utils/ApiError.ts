export class ApiError extends Error {
    statusCode: number;
    data: any;
    errors: string[];
    success: boolean;
  constructor(
    statusCode: number,
    message: string = "Something went wrong!",
    errors: string[] = [],
    stack: string = ""
  ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.message = message;
      this.errors = errors;
      this.success = false;
      if (stack) {
          this.stack = stack;
      } else {
          Error.captureStackTrace(this, this.constructor);
      }
  }
}
