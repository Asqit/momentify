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

YupPassword(yup);

const registerSchema = yup.object().shape({
	username: yup.string().min(4).trim().required(),
	email: yup.string().email().trim().required(),
	password: yup.string().password().minSymbols(0).trim().required(),
});

export function RegisterForm() {
	const [isPassword, setIsPassword] = useState<boolean>(true);
	const [register, { isLoading }] = useRegisterMutation();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			username: '',
			email: '',
			password: '',
		},
		validationSchema: registerSchema,
		onSubmit: async (values) => {
			try {
				await register(values).unwrap();

				navigate('/email-verification');
			} catch (error) {
				toast(String(error));
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
				<form className='flex flex-col gap-3' onSubmit={formik.handleSubmit}>
					<Textfield
						type='email'
						name='email'
						value={formik.values.email}
						onChange={handleChange}
						placeholder={String(t('form.email_placeholder'))}
						label={String(t('form.email'))}
						errorMessage={formik.errors.email}
					/>
					<Textfield
						type='text'
						name='username'
						value={formik.values.username}
						onChange={handleChange}
						label={String(t('form.username'))}
						placeholder={String(t('form.username_placeholder'))}
						errorMessage={formik.errors.username}
					/>
					<Textfield
						name='password'
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
								type='button'
								onClick={() => setIsPassword((prev) => !prev)}
							>
								{<AiOutlineEyeInvisible />}
							</button>
						</Textfield.SubComponent>
					</Textfield>
					<div className='flex gap-x-2'>
						<Button className='w-1/2' onClick={() => navigate('/login')}>
							{t('form.login')}
						</Button>
						<Button className='w-1/2' buttonColor='primary' disabled={!formik.isValid}>
							{t('form.register')}
						</Button>
					</div>
				</form>
			)}
		</>
	);
}
