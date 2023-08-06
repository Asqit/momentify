import { PrismaClient } from '@prisma/client';
import { exit } from 'process';
import { logger } from './logger';

/** Static class used to manage prisma client */
export class PrismaConnector {
	public static readonly client: PrismaClient = new PrismaClient();

	/**
	 * This method is used for initiating a new database connection.
	 * By default prisma uses it's `lazy connection`, but for our purposes, it's better to actually check the connection.
	 *
	 * **Warning:** This method may fail and with it the entire service will exit with code 1
	 */
	public static async connect(): Promise<void> {
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
	 * A method used for destroying the database connection.
	 *
	 * **Warning:** If this method fail, the entire service will exit with code 1
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
