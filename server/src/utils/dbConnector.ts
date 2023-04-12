import { PrismaClient } from '@prisma/client';
import { exit } from 'process';
import { logger } from './logger';

export const dbConnector = {
	/** server-wide `PrismaClient` instance */
	prisma: new PrismaClient(),
	/**
	 * @description This function will connect to desired database. Please note, that it requires a valid `.env` db variable
	 * @throws {Error} An regular error, whenever connection failed.
	 */
	connect: async function () {
		try {
			logger.info('Initializing prisma connector.');
			await this.prisma.$connect();
		} catch (error) {
			logger.error(`Prisma cannot connect to the database`);
			exit(1);
		}
	},
	/**
	 * @description This function will disconnect from database
	 * @throws {Error} An regular error, whenever disconnection failed.
	 */
	disconnect: async function () {
		try {
			logger.info('Prisma is disconnecting from database');
			await this.prisma.$disconnect();
		} catch (error) {
			logger.error(
				`Prisma failed to disconnect with database\n\rdetails: ${String(error)}`,
			);
		}
	},
};
