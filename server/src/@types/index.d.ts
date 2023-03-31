import { ObjectId } from '@prisma/client';

export declare module 'joi' {
	export function objectId(): any;
}

export declare global {
	namespace NodeJS {
		interface Global {
			ObjectId: typeof ObjectId;
		}
	}
}
