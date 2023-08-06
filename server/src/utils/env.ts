import { exit } from 'node:process';

/**
 * Returns value stored in environment variable with the given `name`.
 * Throws Error if no such variable or if variable undefined; thus ensuring type-safety.
 * @param key - name of variable to fetch from this process's environment.
 */
export function env(key: string): string {
	const value = process.env[key];

	if (!value) {
		console.error(`Missing: process.env['${key}'].`);
		exit(1);
	}

	return value;
}
