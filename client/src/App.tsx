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

export default function App() {
	return (
		<>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route path="" element={<Dashboard />}>
						<Route index element={<Home />} />
						<Route path="account" element={<Account />} />
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
