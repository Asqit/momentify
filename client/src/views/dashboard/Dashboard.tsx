import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '~/components';
import { useMediaQuery } from '~/hooks';

export function Dashboard() {
	const isDesktop = useMediaQuery('(min-width: 768px)');

	return (
		<section className="w-full h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-950 py-2">
			{isDesktop ? <Sidebar /> : null}
			<div className="flex-grow overflow-x-hidden rounded-l-3xl">
				<div className="w-full h-full bg-white dark:bg-gray-900 overflow-y-scroll">
					<Outlet />
				</div>
			</div>
			{isDesktop === false ? <Navbar /> : null}
		</section>
	);
}
