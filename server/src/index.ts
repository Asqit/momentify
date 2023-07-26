import { exit } from 'node:process';
import { App } from './App';

/** Main entry point of my RESTful API application */
async function main(): Promise<void> {
	try {
		const arg: string = process.argv[2];

		if (arg === '--cluster') {
			App.initCluster();
			return;
		}

		new App().listen();
	} catch (error) {
		console.error(error);
		exit(1);
	}
}

main();
