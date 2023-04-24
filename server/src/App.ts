import { Server, createServer } from 'node:http';
import { join } from 'node:path';
import { cpus } from 'node:os';
import { PrismaConnector } from './utils/PrismaConnector';
import { logger } from './utils/logger';
import { serverConfig } from '~/config/server.config';
import * as middleware from '~/middlewares';
import * as routes from '~/routes';
import express from 'express';
import cluster, { Worker } from 'cluster';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

/** Main application class. Can be used to create cluster. */
export class App {
	private readonly router: express.Application;
	private readonly PUBLIC_PATH: string;
	private readonly server: Server;

	constructor() {
		this.router = express();
		this.server = createServer(this.router);
		this.PUBLIC_PATH = join(__dirname, 'public');

		this.initMiddlewares();
	}

	/**
	 * This method will serve
	 * every possible endpoint
	 * needed by client
	 */
	private initRoutes() {
		const router = this.router;

		router.use(express.static('public'));
		router.use(express.static(this.PUBLIC_PATH));

		router.use('/api/auth', routes.authRoutes);
		router.use('/api/posts', routes.postRoutes);
		router.use('/api/users', routes.userRoutes);
		router.use('/api/comments', routes.commentRoutes);
	}

	/**
	 * This method will initialize
	 * every middleware used in the app
	 * and also executes `initRoutes`
	 * method.
	 */
	private async initMiddlewares() {
		const router = this.router;

		await PrismaConnector.connect();

		// Disable framework metadata
		router.disable('x-powered-by');

		router.use(compression());
		router.use(express.urlencoded({ extended: true, limit: '12mb' }));
		router.use(express.json());
		router.use(helmet());
		router.use(cors());

		// Logging every request and response
		router.use(middleware.requestLogger);

		this.initRoutes();

		router.use(middleware.notFound);
		router.use(middleware.errorHandler);
	}

	/**
	 * This methods starts the application.
	 * Check console for output
	 */
	public listen() {
		const { API_HOSTNAME, API_PORT } = serverConfig;

		this.server.listen(API_PORT, () => {
			logger.info(
				`New express application with pid of ${process.pid} is now available at http://${API_HOSTNAME}:${API_PORT}`,
			);
		});
	}

	/**
	 * Static method, that will create a new cluster application
	 * @returns Either array of `cluster.Worker` if needed or `undefined`.
	 */
	public static initCluster() {
		let workers: Worker[] = [];

		if (cluster.isPrimary) {
			const CPUS = cpus().length;
			logger.info(`Creating a new node cluster with ${CPUS} workers`);

			for (let i = 0; i < CPUS; i++) {
				workers.push(cluster.fork());
			}

			cluster.on('exit', (worker, code, signal) => {
				workers = workers.filter((wk) => wk.id != worker.id);

				logger.error(
					`Worker (${worker.process.pid}) died with code ${code} and signal ${signal}`,
				);
				logger.info('Replacement worker is being created');

				workers.push(cluster.fork());
			});

			return workers;
		}

		new App().listen();
	}
}
