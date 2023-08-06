import { exit } from 'node:process';
import { App } from './App';

async function main(): Promise<void> {
	try {
		const arg: string = process.argv[2];

		if (arg === '--cluster') {
			App.initAsCluster();
			return;
		}

		new App().listen();
	} catch (error) {
		console.error(error);
		exit(1);
	}
}

main();
