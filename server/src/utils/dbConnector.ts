import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export const dbConnector = {
	prisma: new PrismaClient(),
	connect: async function () {
		await this.prisma.$connect();
	},
	disconnect: async function () {
		await this.prisma.$disconnect();
	},
};
