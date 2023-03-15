import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import http from 'node:http';

import { dbConnector } from './dbConnector';
import * as middleware from '../middlewares';
import * as routes from '../routes';
import { serverConfig } from '../config/server.config';
import { logger } from './logger';

export async function initExpress() {
	const router = express();
	const server = http.createServer(router);
	const { port } = serverConfig.server;

	await dbConnector.connect();

	// Hide framework metadata
	router.disable('x-powered-by');

	router.use(compression());
	router.use(express.urlencoded({ extended: true, limit: '12mb' }));
	router.use(express.json());
	router.use(helmet());
	router.use(cors());
	router.use(middleware.requestLogger);

	router.use('/api/auth', routes.authRouter);

	// TODO: Add client serving here

	router.use(middleware.notFound);
	router.use(middleware.errorHandler);

	server.listen(port, () => {
		logger.info(`A express application with pid of ${process.pid} is now available at http://localhost:${8080}`);
	});
}
