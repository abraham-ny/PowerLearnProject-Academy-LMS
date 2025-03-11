import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import Spinner from '../../../Components/spinner/Spinner';
import AuthSketeton from '../../../Components/auth/AuthSketeton';

function ForgotPassword() {
  const formSchema = yup
    .object({
      email: yup
        .string()
        .required('Email required')
        .email('Enter a valid email'),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(formSchema) });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const baseURL =
    process.env.REACT_APP_BASE_URL ||
    'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

  // reset inputs if submitted
  const onSubmit = (data) => {
    setIsLoading(true);
    axios
      .post(`${baseURL}/auth/student/forgot-password`, data)
      .then(() => {
        toast.success(
          'Password successfully reset. Please check email for reset link'
        );
      })
      .catch(() => {
        toast.error('Something went wrong! Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthSketeton heading="Forgot Password">
      <div className="flex flex-col justify-center items-center">
        <div className="bg-gray-200 rounded-md py-2 px-2 text-xs w-full mb-3 space-y-1">
          <p className="text-xs font-small">
            Please provide the same email address that you used when you
            applying to Power Learn Project.
          </p>
          <p>A password reset link will be sent to your account.</p>
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

          {isLoading ? (
            <div className="grid place-items-center">
              <Spinner />
            </div>
          ) : (
            <button
              type="submit"
              className="bg-claret-500 text-white w-full text-xs rounded-2xl py-2 captialize"
            >
              Request Password Resset Link
            </button>
          )}
        </form>
        <div className="mt-4 flex gap-2 items-center align-middle justify-center">
          <p className="text-sm">Remebered your password?</p>
          <button
            type="button"
            className="grid place-items-center"
            onClick={() => navigate('/login')}
          >
            <small className="underline underline-offset-2 text-claret-500 text-xs font-bold">
              Login here
            </small>
          </button>
        </div>
      </div>
    </AuthSketeton>
  );
}

export default ForgotPassword;
