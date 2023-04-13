import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:8080/api',
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.accessToken;

			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}

			return headers;
		},
	}),
	endpoints: () => ({}),
});
