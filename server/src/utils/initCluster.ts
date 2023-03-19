import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { initExpress } from './initExpress';

import { logger } from './logger';

function createCluster() {
	const THREAD_AMOUNT = cpus().length;
	logger.info(`Creating a new node cluster with ${THREAD_AMOUNT} workers`);

	for (let i = 0; i < THREAD_AMOUNT; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		logger.error(`A worker died with code ${code} and signal of ${signal}`);
		logger.info(`A replacement worker is now being created`);

		cluster.fork();
	});
}

/**
 * This function will either start a single instance of this application or an entire cluster, depending on `NODE_ENV` variable.
 *
 * NODE_ENV="development" will start a single instance
 *
 * NODE_ENV="production"  will start a cluster
 */
export async function initCluster() {
	const { isPrimary } = cluster;
	const isDevelopment = process.env.NODE_ENV === 'development';

	if (isDevelopment) {
		return await initExpress();
	}

	if (isPrimary) {
		createCluster();
	} else {
		await initExpress();
	}
}
