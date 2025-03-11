import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../Components/spinner/Spinner';
import AuthSketeton from '../../../Components/auth/AuthSketeton';
import { setPassword } from '../../../features/auth/authSlice';

function ResetPassword() {
  const formSchema = Yup.object({
    email: Yup.string().required('Email required').email('Enter a valid email'),
    new_password: Yup.string()
      .required('Enter Password')
      .min(6, 'Password must be at least 6 characters long')
      .matches(
        /^.*(?=.{6,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least 6 characters, one uppercase and one number'
      ),
    confirm_new_password: Yup.string()
      .required('Enter Password')
      .oneOf([Yup.ref('new_password')], 'Passwords does not match'),
  }).required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    if (isAuthenticated && !authError && !isLoading) {
      reset({ email: '', password: '' });
      navigate('/');
    }
  }, [isAuthenticated, authError, navigate, reset, isLoading]);

  useEffect(() => {
    if (!isAuthenticated && authError && !isLoading) {
      toast.error(authError);
    }
  }, [isAuthenticated, authError, reset, isLoading]);

  // reset inputs if successfully submitted

  const onSubmit = async (data) => {
    const requestData = { ...data, token };
    dispatch(setPassword(requestData));
  };

  return (
    <AuthSketeton heading="Create Your Password">
      <div className="flex flex-col justify-center items-center">
        <div className="bg-gray-200 rounded-md py-2 px-2 text-xs w-full mb-3 space-y-1">
          <p className="text-xs font-small">
            Please provide the same email address that you used when you
            applying to Power Learn Project.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 ">
        <div className="flex flex-col space-y-2  ">
          <label htmlFor="email" className=" text-sm font-semibold">
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
        <div className="flex flex-col space-y-2  ">
          <label htmlFor="password" className=" text-sm font-semibold">
            New Password
          </label>
          <input
            id="password"
            {...register('new_password', { required: true, maxLength: 15 })}
            className={`border-[0.5px] border-silver-500 rounded-2xl py-2 pl-3 text-xs focus:outline-gray-600 ${
              errors.new_password ? 'border-red-600 focus:outline-red-600' : ''
            }`}
            autoComplete="true"
            type="password"
            placeholder="password"
          />
          {errors.new_password && (
            <span className="text-red-600 text-xs">
              {errors.new_password?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-2  ">
          <label
            htmlFor="confirm_new_password"
            className=" text-sm font-semibold"
          >
            Confirm Password
          </label>
          <input
            id="confirm_new_password"
            {...register('confirm_new_password', {
              required: true,
              maxLength: 15,
            })}
            className={`border-[0.5px] border-silver-500 rounded-2xl py-2 pl-3 text-xs focus:outline-gray-600 ${
              errors.confirm_new_password
                ? 'border-red-600 focus:outline-red-600'
                : ''
            }`}
            autoComplete="true"
            type="password"
            placeholder="Confirm Password"
          />
          {errors.confirm_new_password && (
            <span className="text-red-600 text-xs mt-1">
              {errors.confirm_new_password?.message}
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="grid place-items-center">
            <Spinner />
          </div>
        ) : (
          <button
            type="submit"
            className="bg-claret-500 text-white w-full text-xs rounded-2xl py-2 captialize"
          >
            Save New Password
          </button>
        )}
      </form>
    </AuthSketeton>
  );
}

export default ResetPassword;
