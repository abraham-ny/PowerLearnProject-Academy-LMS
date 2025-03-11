import { startTransition, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../../../features/auth/authSlice';
import Spinner from '../../../Components/spinner/Spinner';
import AuthSketeton from '../../../Components/auth/AuthSketeton';

const schema = yup
  .object({
    email: yup.string().required('Email required').email('Enter a valid email'),
    password: yup.string().required('Enter password'),
  })
  .required();

function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.loading);
  const [shownPassword, setShownPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const redirectTo = searchParams.get('redirectTo');

  useEffect(() => {
    if (isAuthenticated && !authError && !isLoading) {
      reset({ email: '', password: '' });
      startTransition(() => navigate(redirectTo || '/'));
    }
  }, [isAuthenticated, authError, navigate, reset, isLoading, redirectTo]);

  useEffect(() => {
    if (!isAuthenticated && authError && !isLoading) {
      toast.error(authError);
    }
  }, [isAuthenticated, authError, navigate, reset, isLoading]);

  const handleLogin = (data) => {
    dispatch(login(data));
  };

  const togglePasswordVisibility = () => {
    setShownPassword(!shownPassword);
  };

  return (
    <AuthSketeton heading="Welcome Back to PLP Academy.">
      <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className=" text-base font-semibold">
            Email Address
          </label>
          <input
            id="email"
            {...register('email', { required: true, maxLength: 15 })}
            className={`border-[0.5px] border-silver-500 rounded-2xl py-2 pl-3 text-xs focus:outline-gray-600 ${
              errors.email ? 'border-red-600 focus:outline-red-600' : ''
            }`}
            type="email"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <span className="text-red-600 text-xs">
              {errors.email?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className=" text-base font-semibold">
            Password
          </label>
          <input
            id="password"
            {...register('password', { required: true, maxLength: 15 })}
            className={`border-[0.5px]  rounded-2xl py-2 pl-3 text-xs focus:outline-gray-600 ${
              errors.password
                ? 'border-red-600 focus:outline-red-600'
                : 'border-silver-500'
            }`}
            autoComplete="true"
            type={shownPassword ? 'text' : 'password'}
            placeholder="Enter your Password"
          />
          {errors.password && (
            <span className="text-red-600 text-xs">
              {errors.password?.message}
            </span>
          )}
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex items-center">
            <input
              id="show-password"
              onChange={togglePasswordVisibility}
              type="checkbox"
              value="Show Password"
            />
            <label
              htmlFor="show-password"
              className="text-xs text-mine-shaft-500 pl-1"
            >
              Show Password
            </label>
          </div>
          <small className=" text-claret-500 text-base">
            <Link to="/forgot-password">Forgot Password?</Link>
          </small>
        </div>
        <small className="text-base">
          Don&apos;t have an account?{' '}
          <Link
            className="text-claret-500 font-bold"
            to={`/create-account${
              redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
            }`}
          >
            Create here
          </Link>
        </small>
        {isLoading ? (
          <div className="grid place-items-center">
            <Spinner />
          </div>
        ) : (
          <button
            type="submit"
            className="bg-claret-500 text-white w-full text-xl rounded-2xl py-2 capitalize"
          >
            Sign In
          </button>
        )}
      </form>
    </AuthSketeton>
  );
}

export default Login;
