import { combineReducers, configureStore } from '@reduxjs/toolkit';

// App Reducers
import authReducer from './features/auth/auth.slice';
import { authApi } from './features/auth/auth.api';

const reducer = combineReducers({
	auth: authReducer,
	[authApi.reducerPath]: authApi.reducer,
});

export const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(authApi.middleware);
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
