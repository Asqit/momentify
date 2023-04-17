import { Link } from 'react-router-dom';
import { Brand } from '../common/brand/Brand';
import { Hamburger } from '../common/hamburger/Hamburger';
import { LanguageSwitcher } from '~/components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface IAuthNavProps {
	isRegisterView?: boolean;
}

export function AuthNav(props: IAuthNavProps) {
	const { isRegisterView } = props;
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const { t } = useTranslation();

	const toggleIsVisible = () => {
		setIsVisible((prev) => !prev);
	};

	return (
		<header className="flex items-center justify-between p-8 flex-wrap">
			<Brand />
			<div className="sm:hidden">
				<Hamburger onClick={toggleIsVisible} />
			</div>
			<ul
				className={`${
					isVisible ? 'flex' : 'hidden'
				} basis-full md:basis-auto md:flex items-center gap-x-2`}
			>
				<li>
					<Link className="link secondary" to="/">
						{t('auth_nav.home')}
					</Link>
				</li>
				{isRegisterView ? (
					<li>
						<Link className="link secondary" to="/login">
							{t('auth_nav.login')}
						</Link>
					</li>
				) : (
					<li>
						<Link className="link secondary" to="/register">
							{t('auth_nav.register')}
						</Link>
					</li>
				)}
				<li>
					<LanguageSwitcher />
				</li>
			</ul>
		</header>
	);
}

AuthNav.defaultProps = {
	isRegisterView: true,
};
