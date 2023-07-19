import { FormEvent, ReactNode, useState } from 'react';
import { Button, LanguageSwitcher, Modal, Textfield, ToggleSwitch } from '~/components';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from 'usehooks-ts';
import {
	useChangePasswordMutation,
	useDeleteAccountMutation,
} from '~/setup/features/auth/auth.api';
import { useFormik } from 'formik';
import YupPassword from 'yup-password';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { logout } from '~/setup/features/auth/auth.slice';

YupPassword(yup);

export function Settings() {
	const { t } = useTranslation();
	const { toggle, isDarkMode } = useDarkMode();
	const { id } = useAppSelector((st) => st.auth.user!);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [changePassword] = useChangePasswordMutation();
	const [deleteAccount] = useDeleteAccountMutation();
	const dispatch = useAppDispatch();

	const passwordSchema = yup.object({
		password: yup
			.string()
			.password()
			.min(8, String(t('form.error_password_length')))
			.minSymbols(1, String(t('form.error_password_symbols')))
			.minLowercase(1, String(t('form.error_password_lowercase')))
			.minNumbers(4, String(t('form.error_password_numbers')))
			.minUppercase(1, String(t('form.error_password_uppercase')))
			.trim()
			.required(String(t('form.error_required'))),
		newPassword: yup
			.string()
			.password()
			.min(8, String(t('form.error_password_length')))
			.minSymbols(1, String(t('form.error_password_symbols')))
			.minLowercase(1, String(t('form.error_password_lowercase')))
			.minNumbers(4, String(t('form.error_password_numbers')))
			.minUppercase(1, String(t('form.error_password_uppercase')))
			.trim()
			.required(String(t('form.error_required'))),
	});

	const formik = useFormik({
		initialValues: {
			password: '',
			newPassword: '',
		},
		validationSchema: passwordSchema,
		onSubmit: async (values) => {
			try {
				await changePassword(values).unwrap();
				dispatch(logout());
			} catch (error) {}
		},
	});

	const handleAccountDeletion = async () => {
		try {
			await deleteAccount(id).unwrap();
		} catch (error) {}
	};

	const handleChange = (e: FormEvent<HTMLInputElement>) => {
		e.preventDefault();
		const target = e.currentTarget;
		const key = target.name;
		const value = target.value;

		formik.setValues({
			...formik.values,
			[key]: value,
		});
	};

	return (
		<section className="w-full h-full">
			<div className="container max-w-2xl mx-auto h-full p-4 dark:text-gray-200">
				<h1 className="text-xl md:text-3xl font-bold">{t('settings_section.title')}</h1>
				<hr className="dark:border-gray-800 my-4" />
				<ul>
					<ListOption label={t('settings_section.language')}>
						<LanguageSwitcher />
					</ListOption>
					<ListOption label={t('settings_section.theme')}>
						<ToggleSwitch callback={toggle} isEnabled={isDarkMode} />
					</ListOption>
					<ListOption label={t('settings_section.password')}>
						<Button className="p-1 px-2" onClick={() => setIsOpen((prev) => !prev)}>
							change
						</Button>
					</ListOption>
				</ul>
				<div className="border-2 border-red-500 dark:border-red-700 rounded-md p-2">
					<h3 className="font-bold text-lg md:text-xl">
						{t('settings_section.danger_zone')}
					</h3>
					<ul>
						<ListOption label={t('settings_section.delete_account')}>
							<Button
								buttonColor="danger"
								onClick={handleAccountDeletion}
								className="hover:animate-shake"
							>
								{t('settings_section.delete_account')}
							</Button>
						</ListOption>
					</ul>
				</div>
			</div>
			<Modal
				isOpen={isOpen}
				callback={() => setIsOpen((prev) => !prev)}
				className="p-4 rounded-md my-4 dark:bg-slate-950 dark:text-slate-200"
			>
				<h1 className="my-2 text-2xl">Change password</h1>
				<hr />
				<form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 mt-4">
					<Textfield
						label="old password"
						value={formik.values.password}
						name="password"
						placeholder="password"
						type="password"
						onChange={handleChange}
						errorMessage={formik.errors.password}
					/>
					<Textfield
						label="new password"
						name="newPassword"
						value={formik.values.newPassword}
						placeholder="password"
						type="password"
						onChange={handleChange}
						errorMessage={formik.errors.newPassword}
					/>
					<Button buttonColor="primary" type="submit" disabled={!formik.isValid}>
						submit
					</Button>
				</form>
			</Modal>
		</section>
	);
}

interface ListOptionProps {
	children: ReactNode;
	label: string;
}

function ListOption(props: ListOptionProps) {
	const { children, label } = props;

	return (
		<li className="w-full rounded-md my-4 bg-gray-200 dark:bg-gray-800 flex items-center justify-between p-2">
			<span>{label}</span>
			{children}
		</li>
	);
}
