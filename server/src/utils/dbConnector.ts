import { PrismaClient } from '@prisma/client';
import { exit } from 'process';
import { logger } from './logger';

export const dbConnector = {
	prisma: new PrismaClient(),
	connect: async function () {
		try {
			await this.prisma.$connect();
		} catch (error) {
			logger.error(`Prisma cannot connect to the database`);
			exit(1);
		}
	},
	disconnect: async function () {
		await this.prisma.$disconnect();
	},
};
