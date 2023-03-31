import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import http from 'node:http';

import { dbConnector } from './dbConnector';
import * as middlewares from '~/middlewares';
import * as routes from '~/modules';
import { serverConfig } from '~/config/server.config';
import { logger } from './logger';
import path from 'node:path';

export async function initExpress() {
	const router = express();
	const server = http.createServer(router);
	const { API_PORT, API_HOSTNAME } = serverConfig;
	const PUBLIC_PATH = path.join(__dirname, 'public');

	await dbConnector.connect();

	// Hide framework metadata
	router.disable('x-powered-by');

	router.use(compression());
	router.use(express.urlencoded({ extended: true, limit: '12mb' }));
	router.use(express.json());
	router.use(helmet());
	router.use(cors());
	router.use(middlewares.requestLogger);

	// Api endpoints
	router.use('/api/auth', routes.authRoutes);
	router.use('/api/comment', routes.commentRoutes);
	router.use('/api/post', routes.postRoutes);
	router.use('/api/user', routes.userRoutes);
	router.use(express.static('public'));

	// Serve a public folder
	router.use(express.static(PUBLIC_PATH));

	// TODO: Add client serving here

	router.use(middlewares.notFound);
	router.use(middlewares.errorHandler);

	server.listen(API_PORT, () => {
		logger.info(
			`A express application with pid of ${process.pid} is now available at http://${API_HOSTNAME}:${API_PORT}`,
		);
	});
}
