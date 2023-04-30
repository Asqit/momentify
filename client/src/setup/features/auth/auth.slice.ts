import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi as api } from './auth.api';
import { AuthState, LoginResponse, User } from './auth.types';

const initialState: AuthState = {
	user: null,
	accessToken: '',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.accessToken = '';
			state.user = null;
		},
		updateUser: (state, action: PayloadAction<User>) => {
			state.user = {
				...state.user,
				...action.payload,
			};
		},
		updateAccessToken: (state, action: PayloadAction<string>) => {
			state.accessToken = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Login -------------------------->
			.addMatcher(
				api.endpoints.login.matchFulfilled,
				(state, action: PayloadAction<LoginResponse>) => {
					state.accessToken = action.payload.accessToken;
					state.user = action.payload.user;
				},
			)
			// Change password ---------------->
			.addMatcher(api.endpoints.changePassword.matchFulfilled, (state, action) => {
				state.accessToken = '';
				state.user = null;
			})
			// Login via refresh token -------->
			.addMatcher(
				api.endpoints.RefreshLogin.matchFulfilled,
				(state, action: PayloadAction<LoginResponse>) => {
					state.accessToken = action.payload.accessToken;
					state.user = action.payload.user;
				},
			);
	},
});

export default authSlice.reducer;
export const { logout, updateUser, updateAccessToken } = authSlice.actions;
