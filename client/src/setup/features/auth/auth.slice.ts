import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi as api } from './auth.api';
import { AuthState, LoginResponse, User } from './auth.types';
const ACCESS_TOKEN_KEY = 'momentify/access-token';

function getAccessToken() {
	if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
		return '';
	}

	return JSON.parse(localStorage.getItem(ACCESS_TOKEN_KEY)!);
}

const initialState: AuthState = {
	user: null,
	accessToken: getAccessToken(),
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.accessToken = '';
			state.user = null;

			localStorage.removeItem(ACCESS_TOKEN_KEY);
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

					localStorage.setItem(
						ACCESS_TOKEN_KEY,
						JSON.stringify(action.payload.accessToken),
					);
				},
			)
			// Change password ---------------->
			.addMatcher(api.endpoints.changePassword.matchFulfilled, (state) => {
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
			)
			// Delete account ----------------->
			.addMatcher(api.endpoints.deleteAccount.matchFulfilled, (state) => {
				state.accessToken = '';
				state.user = null;
			})
			// Change password ---------------->
			.addMatcher(api.endpoints.changePassword.matchFulfilled, (state) => {
				state.accessToken = '';
				state.user = null;
			});
	},
});

export default authSlice.reducer;
export const { logout, updateUser, updateAccessToken } = authSlice.actions;
