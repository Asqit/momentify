import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '~/components';
import { useMediaQuery } from '~/hooks';

export function Dashboard() {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	return (
		<section className="w-full h-screen flex flex-col md:flex-row">
			{isDesktop ? <Sidebar /> : null}
			<div className="flex-grow overflow-x-hidden overflow-y-auto">
				<Outlet />
			</div>
			{isDesktop === false ? <Navbar /> : null}
		</section>
	);
}
