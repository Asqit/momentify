import { sign, SignOptions, JwtPayload, verify } from 'jsonwebtoken';

interface AccessToken extends JwtPayload {
	email: string;
}

interface EmailToken extends JwtPayload {
	email: string;
	id: string;
}

export function generateToken(payload: any, secret: string, options?: SignOptions) {
	return sign(payload, secret, options);
}

export function isAccessToken(test: unknown): test is AccessToken {
	return (
		(test as AccessToken).email !== undefined &&
		typeof (test as AccessToken).email === 'string' &&
		(test as AccessToken).email !== ''
	);
}

export function isEmailToken(test: unknown): test is EmailToken {
	return (
		(test as EmailToken).id !== undefined &&
		(test as EmailToken).id !== '' &&
		(test as EmailToken).email !== undefined &&
		(test as EmailToken).email !== ''
	);
}
