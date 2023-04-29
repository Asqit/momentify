import {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	createApi,
	fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { updateAccessToken, logout } from './auth/auth.slice';
import { RootState } from '../store';

// -----------------------------------------------------------------
// Differences between Mutations and Query:
// 1. Queries just asks API for data
// 2. Mutations are able to mutate the cached data
// 3. Mutations are able to invalidate cache data and force re-fetch
// -----------------------------------------------------------------

// Following http connector uses fetchBaseQuery
// which uses in-build fetch API
// We also try to utilize auth.accessToken
// Which is used to authenticate user
const baseQuery = fetchBaseQuery({
	baseUrl: '/api',
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.accessToken;

		if (token) {
			headers.set('authorization', `Bearer ${token}`);
		}

		return headers;
	},
});

// Here we extend the http connector
// by having "middleware" which calls
// JWT refreshToken endpoint if
// accessToken is expired
const baseQueryWithReAuth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);
	if (result.error && result.error.status === 401) {
		// try to get a new token
		const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
		if (refreshResult.data) {
			// store the new token
			api.dispatch(
				updateAccessToken((refreshResult.data as { accessToken: string }).accessToken),
			);
			// retry the initial query
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logout());
		}
	}
	return result;
};

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReAuth,
	endpoints: () => ({}),
});
