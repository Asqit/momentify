import { sign, SignOptions, JwtPayload } from 'jsonwebtoken';

interface IMomentifyToken extends JwtPayload {
	email: string;
}

export function generateToken(email: string, secret: string, options?: SignOptions) {
	return sign(email, secret, options);
}

export function isMomentifyToken(test: unknown): test is IMomentifyToken {
	return (
		(test as IMomentifyToken).email !== undefined &&
		typeof (test as IMomentifyToken).email === 'string'
	);
}
