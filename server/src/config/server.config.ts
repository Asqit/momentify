import dotenv from 'dotenv';
import { exit } from 'process';
import { logger } from '~/utils/logger';

dotenv.config();

interface Environment {
	/** A port on which the express aplication is operating */
	API_PORT: string;
	/** A hostname of the express application. (localhost by default) */
	API_HOSTNAME: string;
	/** A mode of the application. (either "development" or "production") */
	NODE_ENV: string;
	/** JWT token secret for authentication */
	ACCESS_TOKEN_SECRET: string;
	/** JWT token secret for email tokens */
	EMAIL_TOKEN_SECRET: string;
	/** JWT token secret for authentication */
	REFRESH_TOKEN_SECRET: string;
	/** A url, which you can use to connect with the database */
	DATABASE_URL: string;
	/** Your email credentials */
	SMTP_USER: string;
	/** Your email credentials */
	SMTP_PASSWORD: string;
	/** e.g. gmail, outlook, seznam... */
	SMTP_SERVICE: string;
	/** A port on which the smtp service is available */
	SMTP_PORT: string;
}

function initEnv(): Environment {
	const config: Partial<Environment> = {};
	const keys: (keyof Environment)[] = [
		'API_PORT',
		'API_HOSTNAME',
		'NODE_ENV',
		'ACCESS_TOKEN_SECRET',
		'EMAIL_TOKEN_SECRET',
		'REFRESH_TOKEN_SECRET',
		'DATABASE_URL',
		'SMTP_USER',
		'SMTP_PASSWORD',
		'SMTP_SERVICE',
		'SMTP_PORT',
	];

	for (const key of keys) {
		const value = process.env[key];

		if (!value) {
			logger.error(`Invalid environmental variable ${key}:${value}`);
			exit(1);
		}

		config[key] = value;
	}

	return config as Environment;
}

export const serverConfig = initEnv();
