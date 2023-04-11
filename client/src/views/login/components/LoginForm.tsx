import { useLoginMutation } from '~/setup/features/auth/auth.api';
import { SlMagnifier } from 'react-icons/sl';
import { Button, Spinner, Textfield } from '~/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useFormik } from 'formik';
import YupPassword from 'yup-password';
import * as yup from 'yup';
import { isAuthErrorResponse } from '~/setup/features/auth/auth.types';
import { toast } from 'react-toastify';

YupPassword(yup);

export function LoginForm() {
	const [isPassword, setIsPassword] = useState<boolean>(false);
	const [login, { isLoading }] = useLoginMutation();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const loginSchema = yup.object({
		email: yup
			.string()
			.email(String(t('form.error_not_email')))
			.trim()
			.required(String(t('form.error_required'))),
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
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (values) => {
			try {
				await login(values).unwrap();

				navigate('..');
			} catch (error) {
				const anyError = error as any;

				if (anyError?.data && isAuthErrorResponse(anyError.data)) {
					toast.error(anyError.data.message);
				} else {
					toast.error(`Unknown error occurred, ended with code ${anyError.code}`);
				}
			}
		},
	});

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
		<>
			{isLoading ? (
				<Spinner />
			) : (
				<form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
					<Textfield
						type="email"
						name="email"
						value={formik.values.email}
						onChange={handleChange}
						placeholder={String(t('form.email_placeholder'))}
						label={String(t('form.email'))}
						errorMessage={formik.errors.email}
					/>
					<Textfield
						name="password"
						value={formik.values.password}
						onChange={handleChange}
						type={isPassword ? 'password' : 'text'}
						label={String(t('form.password'))}
						placeholder={String(t('form.password_placeholder'))}
						errorMessage={formik.errors.password}
					>
						<Textfield.SubComponent>
							<button
								className={`text-3xl ${isPassword ? 'text-gray-600' : 'text-black'}`}
								type="button"
								onClick={() => setIsPassword((prev) => !prev)}
							>
								{<SlMagnifier />}
							</button>
						</Textfield.SubComponent>
					</Textfield>
					<div className="flex gap-x-2">
						<Button className="w-1/2" type="button" onClick={() => navigate('/register')}>
							{t('form.register')}
						</Button>
						<Button
							className="w-1/2"
							buttonColor="primary"
							type="submit"
							disabled={!formik.isValid}
						>
							{t('form.login')}
						</Button>
					</div>
				</form>
			)}
		</>
	);
}
