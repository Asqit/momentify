import { createTransport } from 'nodemailer';
import { serverConfig } from './server.config';

export const transporter = createTransport({
	host: 'smtp.seznam.cz',
	port: 465,
	auth: {
		user: serverConfig.SMTP_USER,
		pass: serverConfig.SMTP_PASSWORD,
	},
});
