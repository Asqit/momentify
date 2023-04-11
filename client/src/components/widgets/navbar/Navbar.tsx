import { Brand } from '~/components/brand/Brand';
import { Hamburger } from '~/components/hamburger/Hamburger';

export function Navbar() {
	return (
		<header className="w-full border-b">
			<nav className="w-[90%] mx-auto flex items-center justify-between py-4">
				<Brand />
				<Hamburger />
			</nav>
		</header>
	);
}
