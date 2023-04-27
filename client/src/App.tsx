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
} from '~/views';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute } from './components';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

export default function App() {
	useEffect(() => {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const isDarkTheme = localStorage.getItem('momentify/theme')
			? JSON.parse(localStorage.getItem('momentify/theme')!).theme === 'dark'
			: false;

		if (isDarkTheme || prefersDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	return (
		<>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route path="" element={<Dashboard />}>
						<Route index element={<Home />} />
						<Route path="account/:id" element={<Account />} />
						<Route path="post/:id" element={<Post />} />
						<Route path="post/create" element={<CreatePost />} />
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
