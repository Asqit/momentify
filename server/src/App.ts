import { join } from 'node:path';
import { cpus } from 'node:os';
import http from 'node:http';
import express from 'express';
import cluster from 'cluster';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { PrismaConnector } from './utils/PrismaConnector';
import { logger } from './utils/logger';
import * as middleware from './middlewares';
import * as routes from './routes';

export class App {
	private readonly router: express.Application;
	private readonly PUBLIC_PATH: string;
	private readonly server: http.Server;

	constructor() {
		this.router = express();
		this.server = http.createServer(this.router);
		this.PUBLIC_PATH = join(__dirname, 'public');

		this.initMiddleware();
	}

	private initRoutes() {
		const router = this.router;

		router.use(express.static('public'));
		router.use(express.static(this.PUBLIC_PATH));

		router.use('/api/auth', routes.authRoutes);
		router.use('/api/posts', routes.postRoutes);
		router.use('/api/users', routes.userRoutes);
		router.use('/api/comments', routes.commentRoutes);
	}

	private async initMiddleware() {
		const router = this.router;

		await PrismaConnector.connect();

		// Disable framework metadata
		router.disable('x-powered-by');

		router.use(compression());
		router.use(express.urlencoded({ extended: true, limit: '12mb' }));
		router.use(express.json());
		router.use(cookieParser());
		router.use(cors({ origin: ['http://localhost:8080', 'http://localhost:5173'] }));
		router.use(middleware.gatekeeper);
		router.use(middleware.requestLogger);

		this.initRoutes();

		router.use(middleware.notFound);
		router.use(middleware.errorHandler);
	}

	public listen() {
		logger.info(
			`A new momentify API has now started 🚀\n\tLocal Machine: http://localhost:8080`,
		);
		this.server.listen(process.env.PORT || 8080);
	}

	public static initAsCluster() {
		if (cluster.isPrimary) {
			const CPUS = cpus().length;
			logger.info(`Creating a new node cluster with ${CPUS} workers`);

			for (let i = 0; i < CPUS; i++) {
				cluster.fork();
			}

			cluster.on('exit', (worker, code, signal) => {
				logger.error(
					`Worker (${worker.process.pid}) died with code ${code} and signal ${signal}`,
				);
				logger.info('Replacement worker is being created');

				cluster.fork();
			});
		}

		new App().listen();
	}
}
