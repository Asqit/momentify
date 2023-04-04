import { Routes, Route } from 'react-router-dom';
import { Homepage, Register, Login, Lost, AboutEmailVerification } from '~/views';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute } from './components';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
	return (
		<>
			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route index element={<Homepage />} />
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
