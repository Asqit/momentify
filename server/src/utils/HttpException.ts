export class HttpException extends Error {
	/**
	 * A status code of the request.
	 *
	 * @default - 500
	 */
	public statusCode: number = 500;

	/**
	 * A localization key for translating errors on client-side
	 */
	public i18ClientKey?: string = '';

	constructor(statusCode: number, message: string, i18ClientKey?: string) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = Error.name;
		this.statusCode = statusCode;
		this.i18ClientKey = i18ClientKey;

		Error.captureStackTrace(this);
	}
}
