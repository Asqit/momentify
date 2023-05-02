import { Routes, Route } from 'react-router-dom';
import {
	Dashboard,
	Register,
	Login,
	Lost,
	AboutEmailVerification,
	Account,
	Post,
	CreatePost,
	Home,
	Settings,
	Explore,
} from '~/views';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute } from './components';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useDarkMode } from 'usehooks-ts';

export default function App() {
	const { isDarkMode } = useDarkMode();

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDarkMode]);

	return (
		<>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route path="" element={<Dashboard />}>
						<Route index element={<Home />} />
						<Route path="explore" element={<Explore />} />
						<Route path="account/:id" element={<Account />} />
						<Route path="post/:id" element={<Post />} />
						<Route path="post/create" element={<CreatePost />} />
						<Route path="settings" element={<Settings />} />
						<Route path="*" element={<Lost />} />
					</Route>
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="*" element={<Lost />} />
				<Route path="/docs">
					<Route path="email-verification" element={<AboutEmailVerification />} />
				</Route>
			</Routes>
			<ToastContainer />
		</>
	);
}
