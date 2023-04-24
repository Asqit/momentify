import {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
	createApi,
	fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { updateAccessToken, logout } from './auth/auth.slice';
import { RootState } from '../store';

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

const baseQueryWithReauth: BaseQueryFn<
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
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
});
