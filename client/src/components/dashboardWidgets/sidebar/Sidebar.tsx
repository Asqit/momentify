// Icons ------------------------------------------------->
import { AiFillHome } from 'react-icons/ai';
import { TbZoomFilled } from 'react-icons/tb';
import { IoIosSettings } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import { BsFillPlusCircleFill } from 'react-icons/bs';
// Functions --------------------------------------------->
import { Brand } from '~/components/common/brand/Brand';
import { MiniProfile } from '~/components/dashboardWidgets/mini-profile/MiniProfile';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { logout as logoutAction } from '~/setup/features/auth/auth.slice';
import { FC } from 'react';

export type SidebarLinkProps = {
	Icon: FC;
	value: string;
	to: string;
	state?: any;
};

const SidebarLink = (props: SidebarLinkProps) => {
	const { Icon, value, to, state } = props;

	return (
		<li>
			<Link
				to={to}
				state={state ? state : null}
				className="group relative  flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
			>
				<Icon /> {value}
				<div className="absolute -z-10 w-[5px] h-full bg-sky-500 transition-all top-0 -right-4 group-hover:-right-5" />
			</Link>
		</li>
	);
};

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
					<MiniProfile {...user} />
				</header>
				<nav className="flex-grow">
					<ul className="h-full">
						<SidebarLink Icon={AiFillHome} value={'Feed'} to={''} />
						<SidebarLink
							Icon={TbZoomFilled}
							value={t('sidebar_widget.explore')}
							to={'explore'}
						/>
						<SidebarLink
							Icon={BsFillPlusCircleFill}
							value={t('sidebar_widget.create')}
							to={'post/create'}
						/>
						<SidebarLink
							Icon={IoIosSettings}
							value={t('sidebar_widget.settings')}
							to={'settings'}
						/>
						<SidebarLink
							Icon={FaUserAlt}
							value={t('sidebar_widget.account')}
							to={'account'}
							state={{ user }}
						/>
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
