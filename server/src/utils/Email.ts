import { SendMailOptions, createTransport } from 'nodemailer';
import { serverConfig } from '~/config/server.config';

/**
 * Class for email manipulation
 *
 * **Note**: class is not instantiable, just contains static methods.
 */
export class Email {
	private static readonly transporter = createTransport({
		host: serverConfig.SMTP_SERVICE,
		port: Number(serverConfig.SMTP_PORT),
		auth: {
			user: serverConfig.SMTP_USER,
			pass: serverConfig.SMTP_PASSWORD,
		},
	});

	/**
	 * Method used when user needs to verify their email address
	 * @param emailTo User's email address which needs to be verified
	 * @param token Token which authenticates this operation
	 * @returns information how email was found
	 */
	public static async sendVerification(emailTo: string, token: string) {
		try {
			const opts: SendMailOptions = {
				from: serverConfig.SMTP_USER,
				to: emailTo,
				subject: 'Momentify - Email verification',
				html: `
                    <h1>Momentify - verify your email address</h1>
                    <br/>
                    <p>To continue, please click the following link to verify your email address.</p>
                    <br/>
                    <a href="http://localhost:${serverConfig.API_PORT}/api/auth/verify/email/${token}">click me</a>
                    <br/>
                    <i>Please note, that this email was automatically generated and thus responding to it makes no sense.<i>
                `,
			};

			const response = await this.transporter.sendMail(opts);

			return response;
		} catch (error) {
			throw new Error(`Email could not be send\n\rDetails: ${error}`);
		}
	}
}
