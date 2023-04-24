import { PrismaClient } from '@prisma/client';
import { exit } from 'process';
import { logger } from './logger';

/**
 * Class used manipulation with Prisma
 *
 * **Note:** This class is not instantiable, just use it's static methods and props.
 */
export class PrismaConnector {
	public static readonly client: PrismaClient = new PrismaClient();

	/**
	 * Method used for initiating database connection. It is not really needed,
	 * because of prisma's `lazy connection`.
	 *
	 * **Note:** If operations fails, the entire application will fail with code 1
	 */
	public static async connect() {
		try {
			logger.info('PrismaClient is now initiating connection with database');
			await this.client.$connect();
			logger.info('PrismaClient has successfully connected with database');
		} catch (error) {
			logger.error(
				`PrismaClient failed to initialize connection with database\n\rdetails: ${error}`,
			);
			exit(1);
		}
	}

	/**
	 * Method used for canceling database connection.
	 *
	 * **Note:** If operations fails, the entire application will fail with code 1
	 */
	public static async disconnect() {
		try {
			logger.info('PrismaClient is now closing the connection with database');
			await this.client.$disconnect();
			logger.info('PrismaClient has successfully disconnected with database');
		} catch (error) {
			logger.error(`PrismaClient failed to disconnect with database\n\rdetails: ${error}`);
			exit(1);
		}
	}
}
