import { Brand } from '~/components/common/brand/Brand';
import { UserDetails } from '../userDetails/UserDetails';
import { AiFillHome } from 'react-icons/ai';
import { TbZoomFilled } from 'react-icons/tb';
import { IoIosSettings } from 'react-icons/io';
import { FaUserAlt } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsChevronLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

export function Sidebar() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { t } = useTranslation();

	const enlargeSidebar = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<aside className="max-w-md border-r relative">
			{/*<button
				type="button"
				onClick={enlargeSidebar}
				className={`absolute z-10 -right-4 bg-white top-1/2 w-[30px] h-[30px] border rounded-full flex items-center justify-center transition-all ${
					isOpen ? 'rotate-0' : 'rotate-180'
				}`}
			>
				<BsChevronLeft />
			</button>*/}
			<div className="w-full h-full p-4 flex flex-col">
				<header>
					<Brand />
					<UserDetails />
				</header>
				<main className="flex-grow">
					<ul className="h-full">
						<Link
							to={''}
							className="flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
						>
							<AiFillHome /> Feed
						</Link>
						<Link
							to={'explore'}
							className="flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
						>
							<TbZoomFilled /> {t('sidebar_widget.explore')}
						</Link>
						<Link
							to={'post/create'}
							className="flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
						>
							<BsFillPlusCircleFill /> {t('sidebar_widget.create')}
						</Link>
						<Link
							to={'settings'}
							className="flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
						>
							<IoIosSettings />
							{t('sidebar_widget.settings')}
						</Link>
						<Link
							to={'account'}
							className="flex my-4 items-center gap-x-4 text-lg font-medium transition-all hover:gap-x-3 cursor-pointer hover:text-sky-500"
						>
							<FaUserAlt />
							{t('sidebar_widget.account')}
						</Link>
					</ul>
				</main>
				<footer className="border-t">
					<button className="flex gap-x-2 items-center font-medium mt-4">
						<HiOutlineLogout />
						Logout
					</button>
				</footer>
			</div>
		</aside>
	);
}
