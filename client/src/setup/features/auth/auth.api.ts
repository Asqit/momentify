import { baseApi } from '../baseApi';
import {
	IChangePasswordBody,
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
		changePassword: builder.mutation({
			query: (credentials: IChangePasswordBody) => ({
				url: '/auth/issue/password',
				method: 'GET',
				body: credentials,
			}),
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
