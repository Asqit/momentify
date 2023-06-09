import { baseApi } from '../baseApi';
import {
	ChangePasswordBody,
	LoginCredentials,
	LoginResponse,
	RegisterCredentials,
	RegisterResponse,
} from './auth.types';

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Login mutation -------------------------------------------->
		login: builder.mutation<LoginResponse, LoginCredentials>({
			query: (credentials) => ({
				url: '/auth/login',
				body: credentials,
				method: 'POST',
			}),
		}),
		// Register mutation ------------------------------------------>
		register: builder.mutation<RegisterResponse, RegisterCredentials>({
			query: (credentials) => ({
				url: '/auth/',
				method: 'POST',
				body: credentials,
			}),
		}),
		// Change password query -------------------------------------->
		changePassword: builder.mutation({
			query: (credentials: ChangePasswordBody) => ({
				url: '/auth/issue/password',
				method: 'PUT',
				body: credentials,
			}),
		}),
		// Change password query -------------------------------------->
		RefreshLogin: builder.mutation<LoginResponse, void>({
			query: () => ({
				method: 'GET',
				url: '/auth/refresh',
			}),
		}),
		deleteAccount: builder.mutation<void, string>({
			query: (id) => ({
				method: 'DELETE',
				url: `/users/${id}`,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useRefreshLoginMutation,
	useChangePasswordMutation,
	useDeleteAccountMutation,
} = authApi;
