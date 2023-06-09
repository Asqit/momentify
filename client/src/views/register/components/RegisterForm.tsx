import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Textfield } from '~/components';
import { useTranslation } from 'react-i18next';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { FormEvent, useState } from 'react';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { useFormik } from 'formik';
import { useRegisterMutation } from '~/setup/features/auth/auth.api';
import { toast } from 'react-toastify';
import { isHttpException } from '~/setup/features/auth/auth.types';

YupPassword(yup);

export function RegisterForm() {
	const [isPassword, setIsPassword] = useState<boolean>(true);
	const [register, { isLoading }] = useRegisterMutation();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const registerSchema = yup.object().shape({
		username: yup
			.string()
			.min(4)
			.trim()
			.required(String(t('form.error_required'))),
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

		verifyPassword: yup
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
			username: '',
			email: '',
			password: '',
			verifyPassword: '',
		},
		validationSchema: registerSchema,
		onSubmit: async (values) => {
			try {
				if (values.password !== values.verifyPassword) {
					toast.error('Passwords does not match');
					return;
				}

				const body: any = values;

				delete body.verifyPassword;

				await register({ ...body }).unwrap();

				navigate('/docs/email-verification');
			} catch (error) {
				const anyError = error as any;

				if (anyError?.data && isHttpException(anyError.data)) {
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
						type="text"
						name="username"
						value={formik.values.username}
						onChange={handleChange}
						label={String(t('form.username'))}
						placeholder={String(t('form.username_placeholder'))}
						errorMessage={formik.errors.username}
					/>
					<div className="flex justify-between gap-x-2">
						<div className="w-1/2">
							<Textfield
								name="password"
								parentClassName="w-full"
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
										{<AiOutlineEyeInvisible />}
									</button>
								</Textfield.SubComponent>
							</Textfield>
						</div>

						<div className="w-1/2">
							<Textfield
								name="verifyPassword"
								parentClassName="w-full"
								value={formik.values.verifyPassword}
								onChange={handleChange}
								type={isPassword ? 'password' : 'text'}
								label={String(t('form.verify_password'))}
								placeholder={String(t('form.verify_password_placeholder'))}
								errorMessage={formik.errors.verifyPassword}
							/>
						</div>
					</div>
					<div className="flex gap-x-2">
						<Button className="w-1/2" onClick={() => navigate('/login')}>
							{t('form.login')}
						</Button>
						<Button
							className="w-1/2"
							buttonColor="primary"
							type="submit"
							disabled={!formik.isValid}
						>
							{t('form.register')}
						</Button>
					</div>
				</form>
			)}
		</>
	);
}
