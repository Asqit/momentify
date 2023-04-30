import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '~/hooks';
import { useRefreshLoginMutation } from '~/setup/features/auth/auth.api';
import { Spinner } from '../common';

export function ProtectedRoute() {
	const { user, accessToken } = useAppSelector((st) => st.auth);
	const [login, { isLoading, isError }] = useRefreshLoginMutation();
	const location = useLocation();

	useEffect(() => {
		(async () => {
			if (!user || (accessToken && isAccessTokenExpired())) {
				await login().unwrap();
			}
		})();
	}, []);

	if (isLoading) {
		return (
			<section className="w-screen h-screen flex items-center justify-center dark:bg-gray-950">
				<Spinner />
			</section>
		);
	}

	if (isError) {
		// Redirect them to the /login page, but save the current location they were
		// trying to go to when they were redirected. This allows us to send them
		// along to that page after they login, which is a nicer user experience
		// than dropping them off on the home page.
		return <Navigate to="/login" state={{ from: location }} />;
	}

	if (!accessToken) {
		// If the user is not authenticated, redirect them to the login page and
		// save the current location so we can send them along to that page after
		// they login.
		return <Navigate to="/login" state={{ from: location }} />;
	}

	return <Outlet />;
}

function isAccessTokenExpired(): boolean {
	// Check whether the access token is expired
	return false;
}
