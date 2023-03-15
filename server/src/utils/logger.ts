import { format, createLogger, transports } from 'winston';

const getTimestamp = () => new Date().toISOString().toUpperCase();

const customFormat = format.printf((info) => {
	return `[${getTimestamp()}] [${info.level.toUpperCase()}] ${info.message}`;
});

export const logger = createLogger({
	level: 'info',
	format: customFormat,
	transports: [new transports.Console()],
});
