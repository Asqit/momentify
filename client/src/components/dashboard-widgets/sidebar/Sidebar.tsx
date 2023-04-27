// Icons ------------------------------------------------->
import { AiFillHome } from 'react-icons/ai';
import { BsCompassFill } from 'react-icons/bs';
import { IoIosSettings } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import { BsFillPlusCircleFill } from 'react-icons/bs';
// Functions --------------------------------------------->
import { Brand } from '~/components/common/brand/Brand';
import { MiniProfile } from '~/components';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { logout as logoutAction } from '~/setup/features/auth/auth.slice';
import { FC, useState } from 'react';

export type SidebarLinkProps = {
	Icon: FC;
	value: string;
	to: string;
	state?: any;
};

const SidebarLink = (props: SidebarLinkProps) => {
	const { Icon, value, to, state } = props;
	const [isActive, setIsActive] = useState<boolean>(false);

	return (
		<li>
			<NavLink
				to={to}
				state={state ? state : null}
				className={({ isActive, isPending }) => {
					if (!isPending) {
						setIsActive(isActive);
					}

					return `group relative  flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500 ${
						isActive ? 'text-sky-500 gap-x-3' : 'text-gray-700'
					}`;
				}}
			>
				<Icon /> {value}
				<div
					className={`absolute -z-10 w-[8px] h-full bg-sky-500 transition-all top-0 -right-5 group-hover:z-10 ${
						isActive ? 'z-10' : '-z-10'
					}`}
				/>
			</NavLink>
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
		<aside className="w-[280px] relative bg-gray-100 dark:bg-gray-950 flex-shrink-0">
			<div className="w-full h-full p-4 flex flex-col overflow-y-auto overflow-x-hidden">
				<header>
					<div className="mb-4">
						<Brand />
					</div>
					<div className="my-4 mt-8">
						<MiniProfile {...user} />
					</div>
				</header>
				<nav className="flex-grow">
					<ul className="h-full">
						<SidebarLink Icon={AiFillHome} value={'Feed'} to={''} />
						<SidebarLink
							Icon={BsCompassFill}
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
							to={`/account/${user.id}`}
						/>
					</ul>
				</nav>
				<footer>
					<hr className="dark:border-gray-800" />
					<button
						onClick={logout}
						className="flex gap-x-2 items-center font-medium mt-4 text-gray-700 hover:text-red-500"
					>
						<HiOutlineLogout />
						{t('sidebar_widget.logout')}
					</button>
				</footer>
			</div>
		</aside>
	);
}
