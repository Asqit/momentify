import { baseApi } from '../baseApi';
import { ILoginCredentials, ILoginResponse, IRegisterCredentials } from './auth.types';

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Login mutation --------------------------------------------
		login: builder.mutation<ILoginResponse, ILoginCredentials>({
			query: (credentials) => ({
				url: '/auth/login',
				body: credentials,
				method: 'POST',
			}),
		}),
		// Register mutation ------------------------------------------
		register: builder.mutation<void, IRegisterCredentials>({
			query: (credentials) => ({
				url: '/auth/',
				method: 'POST',
				body: credentials,
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
