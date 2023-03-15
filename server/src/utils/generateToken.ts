import { sign, SignOptions, JwtPayload } from 'jsonwebtoken';
import { serverConfig } from '../config/server.config';

interface IMomentifyToken extends JwtPayload {
	email: string;
}

function generateToken(email: string, secret: string, options: SignOptions) {
	return sign(email, secret, {
		...options,
	});
}

export function generateAccessToken(email: string, options?: SignOptions) {
	const SECRET = serverConfig.jwt.accessTokenSecret;

	if (!SECRET) {
		throw new Error("Error: Missing env. variable 'ACCESS_TOKEN_SECRET'");
	}

	return generateToken(email, SECRET, {
		...options,
		expiresIn: '5 hours',
	});
}

export function isMomentifyToken(test: unknown): test is IMomentifyToken {
	return (test as IMomentifyToken).email !== undefined;
}
