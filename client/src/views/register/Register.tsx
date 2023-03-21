import { Link } from 'react-router-dom';
import { Brand } from '~/components';
import { Textfield } from '~/components/textfield/Textfield_old';
import { RegisterForm } from './components/RegisterForm';

export function Register() {
  return (
    <section className='w-full'>
      <div className='h-screen lg:grid lg:grid-cols-2'>
        <main className='w-full h-full flex flex-col'>
          <header className='flex items-center justify-between p-8'>
            <Brand />
            <ul className='flex items-center gap-x-2'>
              <li>
                <Link className='link' to='..'>
                  Home
                </Link>
              </li>
              <li>
                <Link className='link' to='/login'>
                  Login
                </Link>
              </li>
            </ul>
          </header>
          <article className='flex-grow flex flex-col justify-center items-center'>
            <div className='max-w-5xl w-full md:w-[90%] p-4'>
              <h1 className='text-3xl md:text-5xl font-black mb-4'>
                Create a new account
                <span className='inline-block ml-1 w-1 h-1 md:w-2 md:h-2 bg-sky-500 rounded-full' />
              </h1>
              <h4 className='text-gray-400 font-semibold text-lg mb-8'>
                Already a member?{' '}
                <Link className='link' to='/login'>
                  Log In
                </Link>
              </h4>
              <RegisterForm />
            </div>
          </article>
        </main>
        <figure className='hidden lg:block bg-gradient-to-br from-white via-white to-sky-500'></figure>
      </div>
    </section>
  );
}
