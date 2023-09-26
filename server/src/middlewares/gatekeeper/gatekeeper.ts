import { Request, Response, NextFunction } from 'express';
import { exit } from 'process';
import { Email } from '../../utils/Email';
import { logger } from '../../utils/logger';

export interface Attempt {
	/** unix timestamp of each attempt */
	timestamp: number;

	/** storing credentials, so that we can notify user of credential breach */
	credentials: {
		email: string;
		password: string;
	};
}

interface BlackListRecord {
	attempts: Attempt[];
	ipAddress: string;
}

const heap: string[] = [];

const blackList: Map<string, BlackListRecord> = new Map();

/** Middleware serving as gatekeeper for login endpoint.
 * We catch any ip address, that keeps failing to login and let it try again after 1 hour time limit expires */
export async function gatekeeper(req: Request, res: Response, next: NextFunction) {
	try {
		const bits = req.path.split('/');
		const endpoint = bits[bits.length - 1];
		const ip = req.socket.remoteAddress!;
		const attempt: Attempt = {
			timestamp: Date.now(),
			credentials: req.body,
		};

		// Skip if endpoint is not login
		if (endpoint !== 'login') {
			return next();
		}

		// If ip is already in black-list, check it's attempts amount and
		// if larger than 3, then block.
		if (blackList.has(ip)) {
			const prev = blackList.get(ip)!;

			// Reset after 1 hour of last attack
			const now = new Date();
			const lastAttempt = prev.attempts[prev.attempts.length - 1].timestamp;
			const convertedEpoch = new Date(lastAttempt * 1000);
			const hourDifference = (now.getTime() - convertedEpoch.getTime()) / (1000 * 60 * 60);

			if (hourDifference > 1) {
				blackList.delete(ip);
			}

			// More than allowed amount of attempts results in ban.
			if (prev.attempts.length >= 2) {
				logger.warn(
					`Too many request from ${ip}. Further tries to login will be forbidden.`,
				);

				res.status(403).json({
					message: 'Too many attempts. Try again in 1 hour.',
				});

				await Email.sendLoginWarning(req.body.email, attempt);

				return;
			}

			// Less than 3 attack, then just append the current attack
			// to the attack array.
			blackList.set(ip, {
				ipAddress: ip,
				attempts: [...prev.attempts, attempt],
			});
		}

		if (heap.includes(ip) && !blackList.has(ip)) {
			blackList.set(ip, {
				ipAddress: ip,
				attempts: [attempt],
			});
		} else {
			heap.push(ip);
		}

		res.on('finish', () => {
			const { statusCode } = res;

			// Any other response will result in blacklist addition.
			if (statusCode === 200) {
				heap.splice(heap.indexOf(ip), 1);
			}
		});

		next();
	} catch (error) {
		logger.error(`An error occurred: ${error}`);
		exit(1);
	}
}
