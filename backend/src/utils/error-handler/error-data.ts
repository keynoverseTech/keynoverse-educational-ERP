export class ErrorData {
  message: string;
  details?: any;

  constructor(message: string, details?: any) {
    this.message = message;
    this.details = details;
    Object.setPrototypeOf(this, ErrorData.prototype);
  }
}
