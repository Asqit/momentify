import { serverConfig } from '~/config/server.config';
import { App } from './App';

function wrapper() {
	if (serverConfig.NODE_ENV === 'development') {
		return new App().listen();
	}

	App.initCluster();
}

wrapper();
