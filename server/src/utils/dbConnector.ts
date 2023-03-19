import { PrismaClient } from '@prisma/client'

export const dbConnector = {
	prisma: new PrismaClient(),
	connect: async function () {
		await this.prisma.$connect()
	},
	disconnect: async function () {
		await this.prisma.$disconnect()
	},
}
