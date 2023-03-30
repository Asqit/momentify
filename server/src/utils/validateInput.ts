import { ObjectSchema } from 'yup';

/**
 * @description This function is made to simplify our work when validating data.
 * @throws A new generic error when validation fails.
 *
 * **Example:**
 *
 * ```ts
 * 	import { Assets } from "yup";
 *  import { registerSchema } from "~/schemas";
 *
 * function register(req:Request, res:Response) {
 * 	const { email, password, username } = await validateInput<Asserts<typeof registerSchema>>(
 *  	registerSchema,
 *  	req.body
 *  );
 *
 *   const user = new User({email, password, username}); // Using already valid data
 *
 *    delete user.password
 *
 *   res.status(201).json({
 *      user
 *   })
 * }
 * ```
 */
export const validateInput = async <T>(
	schema: ObjectSchema<any>,
	input: any,
): Promise<T> => {
	try {
		await schema.validate(input, { abortEarly: false });
		return schema.cast(input);
	} catch (error) {
		throw new Error(`Cannot validate yup schema.\n\rdetails: ${error}`);
	}
};
