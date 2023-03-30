import { baseApi } from '../baseApi';
import {
	IAuthErrorResponse,
	ILoginCredentials,
	ILoginResponse,
	IRegisterCredentials,
	IRegisterResponse,
} from './auth.types';

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
		register: builder.mutation<IRegisterResponse, IRegisterCredentials>({
			query: (credentials) => ({
				url: '/auth/',
				method: 'POST',
				body: credentials,
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
