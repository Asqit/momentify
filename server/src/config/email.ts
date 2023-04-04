import { createTransport } from 'nodemailer';
import { serverConfig } from './server.config';

export const transporter = createTransport({
	host: serverConfig.SMTP_SERVICE,
	port: Number(serverConfig.SMTP_PORT),
	auth: {
		user: serverConfig.SMTP_USER,
		pass: serverConfig.SMTP_PASSWORD,
	},
});
