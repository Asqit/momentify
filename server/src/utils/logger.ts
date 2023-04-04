import { format, createLogger, transports } from 'winston';

const getTimestamp = () => new Date().toISOString().toUpperCase();

const customFormat = format.printf((info) => {
	return `[${getTimestamp()}] [${info.level.toUpperCase()}] ${info.message}`;
});

export const logger = createLogger({
	level: 'info',
	transports: [
		new transports.Console({
			format: customFormat,
		}),
		new transports.File({
			filename: `./public/logs/${getTimestamp()}-log.txt`,
			level: 'info',
		}),
	],
});
