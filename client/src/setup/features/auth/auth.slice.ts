import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi as api } from './auth.api';
import { AuthState, LoginResponse } from './auth.types';

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
			});
	},
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
