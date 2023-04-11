import { Outlet } from 'react-router-dom';
import { Navbar } from '~/components';

export function Homepage() {
	return (
		<section>
			<Navbar />
			<Outlet />
		</section>
	);
}
