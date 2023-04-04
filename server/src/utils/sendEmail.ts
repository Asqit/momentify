import { transporter } from '~/config/email';
import { SendMailOptions } from 'nodemailer';
import { serverConfig } from '~/config/server.config';

async function sendEmail(options: SendMailOptions) {
	await transporter.sendMail(options);
}

async function sendVerificationEmail(emailTo: string, token: string) {
	try {
		const options: SendMailOptions = {
			from: serverConfig.SMTP_USER,
			to: emailTo,
			subject: 'Momentify - Email verification',
			html: `
				<h1>Email verification</h1>
				<p>Please click the following link to verify your email:</p>
				<a href="http://localhost:${serverConfig.API_PORT}/api/auth/verify/email/${token}">verify</a>
				<p>Please note, that this email was generate automatically and responding to it makes no sense.<p>
			`,
		};

		const response = await transporter.sendMail(options);

		return response;
	} catch (error) {
		throw new Error(`Email could not be delivered\n\rdetails:${error}`);
	}
}

export { sendVerificationEmail, sendEmail };
