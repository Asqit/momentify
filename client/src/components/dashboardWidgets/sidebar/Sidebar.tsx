// Icons ------------------------------------------------->
import { AiFillHome } from 'react-icons/ai';
import { TbZoomFilled } from 'react-icons/tb';
import { IoIosSettings } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import { BsFillPlusCircleFill } from 'react-icons/bs';
// Functions --------------------------------------------->
import { Brand } from '~/components/common/brand/Brand';
import { UserDetails } from '../userDetails/UserDetails';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { logout as logoutAction } from '~/setup/features/auth/auth.slice';

export function Sidebar() {
	const { t } = useTranslation();
	const user = useAppSelector((st) => st.auth.user!);
	const dispatch = useAppDispatch();

	const logout = () => {
		dispatch(logoutAction());
	};

	return (
		<aside className="max-w-lg border-r relative bg-white">
			<div className="w-full h-full p-4 flex flex-col">
				<header>
					<Brand />
					<UserDetails {...user} />
				</header>
				<nav className="flex-grow">
					<ul className="h-full">
						<li>
							<Link
								to={''}
								className="group relative  flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
							>
								<AiFillHome /> Feed
								<div className="absolute -z-10 w-[5px] h-full bg-sky-500 transition-all top-0 -right-4 group-hover:-right-6" />
							</Link>
						</li>
						<li>
							<Link
								to={'explore'}
								className="group relative  flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
							>
								<TbZoomFilled /> {t('sidebar_widget.explore')}
								<div className="absolute -z-10 w-[5px] h-full bg-sky-500 transition-all top-0 -right-4 group-hover:-right-6" />
							</Link>
						</li>
						<li>
							<Link
								to={'post/create'}
								className="group relative  flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
							>
								<BsFillPlusCircleFill /> {t('sidebar_widget.create')}
								<div className="absolute -z-10 w-[5px] h-full bg-sky-500 transition-all top-0 -right-4 group-hover:-right-6" />
							</Link>
						</li>
						<li>
							<Link
								to={'settings'}
								className="group relative  flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
							>
								<IoIosSettings />
								{t('sidebar_widget.settings')}

								<div className="absolute -z-10 w-[5px] h-full bg-sky-500 transition-all top-0 -right-4 group-hover:-right-6" />
							</Link>
						</li>
						<li>
							<Link
								to="account"
								className="group relative flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
								state={{ user }}
							>
								<FaUserAlt />
								{t('sidebar_widget.account')}

								<div className="absolute -z-10 w-[5px] h-full bg-sky-500 transition-all top-0 -right-4 group-hover:-right-6" />
							</Link>
						</li>
					</ul>
				</nav>
				<footer className="border-t">
					<button
						onClick={logout}
						className="flex gap-x-2 items-center font-medium my-4 hover:text-red-500"
					>
						<HiOutlineLogout />
						Logout
					</button>
				</footer>
			</div>
		</aside>
	);
}
