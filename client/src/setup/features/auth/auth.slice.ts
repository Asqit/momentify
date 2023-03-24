import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi as api } from './auth.api';
import { IAuthState, ILoginResponse } from './auth.types';

const initialState: IAuthState = {
	user: null,
	accessToken: '',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		// Login --------------------------
		builder.addMatcher(api.endpoints.login.matchFulfilled, (state, action: PayloadAction<ILoginResponse>) => {
			state.accessToken = action.payload.accessToken;
			state.user = action.payload.user;
		});
	},
});

export default authSlice.reducer;
