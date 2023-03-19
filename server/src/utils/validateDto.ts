import { plainToInstance } from 'class-transformer'
import { validate, ValidationError, ValidatorOptions } from 'class-validator'
import { sanitize } from 'class-sanitizer'

async function validateDto(type: any, payload: any, options?: ValidatorOptions) {
	const opts = options ?? { skipMissingProperties: false }
	const instance = plainToInstance(type, payload)
	const errors = await validate(instance, opts)

	if (errors.length > 0) {
		const dtoErrors = errors
			.map((error: ValidationError) => (Object as any).values(error.constraints))
			.join(', ')

		throw new Error(dtoErrors)
	}

	return sanitize(instance)
}

export { validateDto }
