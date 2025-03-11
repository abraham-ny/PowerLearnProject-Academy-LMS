/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useController, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import Spinner from '../../../Components/spinner/Spinner';
import AuthSketeton from '../../../Components/auth/AuthSketeton';
import countryOptions from '../../../utils/constants/countryOptions';

const baseURL =
  process.env.REACT_APP_BASE_URL ||
  'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

const schema = yup
  .object({
    firstname: yup.string().required('First name is required').max(10),
    lastname: yup.string().required('Last name is required').max(10),
    email: yup
      .string()
      .required('Email is required')
      .email('Enter a valid email'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long')
      .matches(
        /^.*(?=.{6,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least 6 characters, one uppercase and one number'
      ),
    confirm_password: yup
      .string()
      .required('Enter Password')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
    country: yup.string().required('Please select a counrty'),
    gender: yup.string().required('Please select an option'),
  })
  .required();

function Register() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restLevelField
    },
  } = useController({ name: 'country', control });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.loading);
  const [shownPassword, setShownPassword] = useState(false);

  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirectTo');

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
  }, [isAuthenticated, authError, navigate, reset, isLoading]);

  const handleRegister = (data) => {
    axios
      .post(`${baseURL}/users/student/non-sponsored`, data)
      .then((res) => {
        toast.success(
          'Account created successfully. Kindly go ahead and login.'
        );
        navigate(
          `/login${
            redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
          }`
        );
      })
      .catch((err) => {
        if (Number(err?.response?.status) === 409) {
          toast.error('Account already exists. Kindly go ahead and login.');
          navigate(
            `/login${
              redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
            }`
          );
        } else {
          toast.error(
            `Account creation failed. ${
              typeof err === 'string' ? err : err?.response?.data?.error
            }. Please try again.`
          );
        }
      });
  };

  const togglePasswordVisibility = () => {
    setShownPassword(!shownPassword);
  };

  return (
    <AuthSketeton heading="Welcome to PLP Academy.">
      <form className="space-y-4" onSubmit={handleSubmit(handleRegister)}>
        <div className="grid grid-cols-1 md:grid-cols-2 my-4 gap-4">
          <div className="flex flex-col space-y-2  ">
            <label htmlFor="email" className=" text-base font-semibold">
              First Name
            </label>
            <input
              id="email"
              {...register('firstname')}
              className={`border-[0.5px] border-silver-500 rounded-2xl py-2 pl-3 text-xs focus:outline-gray-600 ${
                errors.firstname ? 'border-red-600 focus:outline-red-600' : ''
              }`}
              type="text"
              placeholder="First Name"
            />
            {errors.firstname && (
              <span className="text-red-600 text-xs">
                {errors.firstname?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2  ">
            <label htmlFor="email" className=" text-base font-semibold">
              Last Name
            </label>
            <input
              id="lastname"
              {...register('lastname')}
              className={`border-[0.5px] border-silver-500 rounded-2xl py-2 pl-3 text-xs focus:outline-gray-600 ${
                errors.lastname ? 'border-red-600 focus:outline-red-600' : ''
              }`}
              type="text"
              placeholder="Last Name"
            />
            {errors.lastname && (
              <span className="text-red-600 text-xs">
                {errors.lastname?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2  ">
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

          <div className="flex flex-col space-y-2  ">
            <label htmlFor="country" className=" text-base font-semibold">
              Country
            </label>
            <select
              {...register('country')}
              className={`border-[0.5px] border-silver-500 rounded-2xl py-2 px-3 text-xs focus:outline-gray-600 ${
                errors.country ? 'border-red-600 focus:outline-red-600' : ''
              }`}
              name="country"
              id="country"
            >
              {countryOptions.map((country) => (
                <option
                  className="px-2"
                  key={country.value}
                  value={country.value}
                >
                  {country.label}
                </option>
              ))}
            </select>
            {errors.country && (
              <span className="text-red-600 text-xs">
                {errors.country?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2  ">
            <label htmlFor="gender" className=" text-base font-semibold">
              Gender
            </label>
            <select
              {...register('gender')}
              className={`border-[0.5px] border-silver-500 rounded-2xl py-2 px-3 text-xs focus:outline-gray-600 ${
                errors.email ? 'border-red-600 focus:outline-red-600' : ''
              }`}
              name="gender"
              id="gender"
            >
              <option className="px-2" value="male">
                Male
              </option>
              <option className="px-2" value="female">
                Female
              </option>
              <option className="px-2" value="non-binary">
                Non binary
              </option>
            </select>
            {errors.gender && (
              <span className="text-red-600 text-xs">
                {errors.gender?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2  ">
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
          <div className="flex flex-col space-y-2  ">
            <label
              htmlFor="confirm_password"
              className=" text-base font-semibold"
            >
              Confirm Password
            </label>
            <input
              id="password"
              {...register('confirm_password', {
                required: true,
                maxLength: 15,
              })}
              className={`border-[0.5px]  rounded-2xl py-2 pl-3 text-xs focus:outline-gray-600 ${
                errors.confirm_password
                  ? 'border-red-600 focus:outline-red-600'
                  : 'border-silver-500'
              }`}
              autoComplete="true"
              type={shownPassword ? 'text' : 'password'}
              placeholder="Confirm your Password"
            />
            {errors.confirm_password && (
              <span className="text-red-600 text-xs">
                {errors.confirm_password?.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex items-center ">
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
          </small>{' '}
        </div>
        <small className="text-base">
          Already have an account?{' '}
          <Link
            className="text-claret-500 font-bold"
            to={`/login${
              redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
            }`}
          >
            Login here
          </Link>
        </small>{' '}
        {isLoading ? (
          <div className="grid place-items-center">
            <Spinner />
          </div>
        ) : (
          <button
            type="submit"
            className="bg-claret-500 text-white w-full text-xl rounded-2xl py-2 captialize"
          >
            Sign Up
          </button>
        )}
      </form>
    </AuthSketeton>
  );
}

export default Register;
