import { Request, Response, NextFunction } from 'express'
import { HttpException } from '~/utils/HttpException'

export function errorHandler(
	err: HttpException | Error,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { stack, message } = err
		const response: any = { message }

		if (err instanceof HttpException) {
			response.statusCode = err.statusCode
		} else {
			response.statusCode = res.statusCode ?? 500
		}

		if (process.env.NODE_ENV === 'development') {
			response.stack = stack
		}

		res.status(response.statusCode).json(response)
	} catch (error) {
		res.status(500).json({
			error,
		})
	}
}
