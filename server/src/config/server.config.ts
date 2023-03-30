import dotenv from 'dotenv';
import { exit } from 'process';
import { logger } from '~/utils/logger';

dotenv.config();

interface Environment {
	API_PORT: string;
	API_HOSTNAME: string;
	NODE_ENV: string;
	ACCESS_TOKEN_SECRET: string;
	EMAIL_TOKEN_SECRET: string;
	DATABASE_URL: string;
}

function initEnv(): Environment {
	const config: any = {};
	const keys = [
		'API_PORT',
		'API_HOSTNAME',
		'NODE_ENV',
		'ACCESS_TOKEN_SECRET',
		'EMAIL_TOKEN_SECRET',
		'DATABASE_URL',
	];
	const KEYS_LENGTH = keys.length;

	for (let i = 0; i < KEYS_LENGTH; i++) {
		const KEY = keys[i];

		if (!process.env[KEY]) {
			logger.error(`Invalid environmental variable ${KEY}:${process.env[KEY]}`);
			exit(1);
		}

		config[KEY] = process.env[KEY];
	}

	return config;
}

export const serverConfig = initEnv();
