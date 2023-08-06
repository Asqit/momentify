import { SendMailOptions, createTransport } from 'nodemailer';
import { Attempt } from '../middlewares';
import { env } from './env';

/** Static class for emailing */
export class Email {
	private static readonly transporter = createTransport({
		host: env('SMTP_SERVICE'),
		port: +env('SMTP_PORT'),
		auth: {
			user: env('SMTP_USER'),
			pass: env('SMTP_PASSWORD'),
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
				from: env('SMTP_USER'),
				to: emailTo,
				subject: 'Momentify - Email verification',
				html: `
                    <h1>Momentify - verify your email address</h1>
                    <br/>
                    <p>To continue, please click the following link to verify your email address.</p>
                    <br/>
                    <a href="http://localhost:${env(
											'PORT',
										)}/api/auth/verify/email/${token}">click me</a>
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

	/**
	 * A method used to notify our user about attack on his/her account
	 * @param emailTo user's email address
	 * @param attackDetails details about the attack (time and credentials)
	 * @returns info about the email
	 */
	public static async sendLoginWarning(emailTo: string, attackDetails: Attempt) {
		try {
			const opts: SendMailOptions = {
				from: env('SMTP_USER'),
				to: emailTo,
				subject: 'Momentify - Login Warning',
				html: `
					<h1>Momentify - Account Security Warning</h1>
					<p>Hello, we noticed multiple invalid login attempts with your credentials.</p>
					<details>
						<summary>Attack Details</summary>
						<ul>
							<li><b>Date</b>: ${new Date(attackDetails.timestamp).toUTCString()} UTC</li>
							<li><b>Used Password</b>: ${attackDetails.credentials.password}</li>
						</ul>
					</details>
				`,
			};

			const resp = await this.transporter.sendMail(opts);

			return resp;
		} catch (error) {
			throw new Error(`Email could not be send\n\rDetails: ${error}`);
		}
	}
}
