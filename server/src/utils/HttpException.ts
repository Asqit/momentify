export class HttpException extends Error {
	public statusCode: number = 500;

	constructor(statusCode: number, message: string) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);
		this.name = Error.name;
		this.statusCode = statusCode;
		Error.captureStackTrace(this);
	}
}
