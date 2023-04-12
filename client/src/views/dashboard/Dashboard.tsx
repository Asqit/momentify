import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '~/components';
import { useMediaQuery } from '~/hooks';

export function Dashboard() {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	return (
		<section className="w-full h-screen flex flex-col md:flex-row">
			{isDesktop ? <Sidebar /> : <Navbar />}
			<div className="flex-grow">
				<Outlet />
			</div>
		</section>
	);
}
