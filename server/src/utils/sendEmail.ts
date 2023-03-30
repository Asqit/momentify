import { transporter } from '~/config/email';
import { SendMailOptions } from 'nodemailer';

export async function sendEmail(options: SendMailOptions) {
	const response = await transporter.sendMail(options);
}
