import { Link } from 'react-router-dom';
import { useAppSelector } from '~/hooks';
// Icons ------------------------------------------------->
import { AiFillHome } from 'react-icons/ai';
import { TbZoomFilled } from 'react-icons/tb';
import { IoIosSettings } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { BsFillPlusCircleFill } from 'react-icons/bs';

export function Navbar() {
	const user = useAppSelector((st) => st.auth.user!);

	return (
		<nav className="w-full border-t dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800">
			<div className="p-4">
				<ul className="flex items-center justify-evenly">
					<Link
						to={''}
						className="font-semibold text-lg  transition-colors hover:text-sky-500"
					>
						<AiFillHome />
					</Link>
					<Link
						to={'explore'}
						className="font-semibold text-lg  transition-colors hover:text-sky-500"
					>
						<TbZoomFilled />
					</Link>
					<Link
						to={'post/create'}
						className="font-semibold text-lg  transition-colors hover:text-sky-500"
					>
						<BsFillPlusCircleFill />
					</Link>
					<Link
						to={'settings'}
						className="font-semibold text-lg  transition-colors hover:text-sky-500"
					>
						<IoIosSettings />
					</Link>
					<Link
						to={`/account/${user ? user.id : ''}`}
						className="font-semibold text-lg  transition-colors hover:text-sky-500"
					>
						<FaUserAlt />
					</Link>
				</ul>
			</div>
		</nav>
	);
}
