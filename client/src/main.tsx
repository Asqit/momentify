import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '~/setup/store';
import { disableReactDevTools } from './disableReactDevTools';
import '~/setup/i18next';
import '~/assets/index.css';
import App from '~/App';

if (process.env.NODE_ENV !== 'development') {
	disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
);
