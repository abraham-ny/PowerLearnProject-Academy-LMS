import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import logo from '../Assets/img/logo.png';
import Spinner from '../Components/spinner/Spinner';

function VerifiyCert() {
  const schema = yup.object({
    initiator_email: yup
      .string()
      .email('Enter a valid email')
      .required('Your email address is required'),
    initiator_name: yup.string().required('Your email address is required'),
  });

  const { studentId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const baseURL =
    process.env.REACT_APP_BASE_URL ||
    'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // eslint-disable-next-line consistent-return
  const onSubmit = async (data) => {
    setIsLoading(true);
    const requestBody = {
      ...data,
      student_id: studentId,
    };
    try {
      const response = await axios.post(
        `${baseURL}/blockchain/student/verify-cert`,
        requestBody
      );
      setIsLoading(false);
      if (response.data.status_code === 200) {
        reset();
        toast.success(
          'Certificate verification in progress. An email with the details will be sent to you'
        );
      }
    } catch (error) {
      setIsLoading(false);
      // reset();
      if (error?.response?.status === 404) {
        toast.error("There is no record for this student's certificate.");
      } else if (error?.response?.status === 501) {
        toast.error(
          'Verification feature currently unavailable. Please try again later.'
        );
      } else {
        return toast.error('Something went wrong. Please try again');
      }
    }
  };
  return (
    <div className=" font-roboto_light w-full h-screen flex flex-col items-center">
      <div className="z-10 py-6 fixed top-0 w-full px-6 bg-[#EFEFEF]  ">
        <nav className=" bg-white rounded-lg px-[2.8%] flex items-center justify-between h-20">
          <div className=" flex align-middle items-center space-x-10">
            <div onClick={() => navigate('/')}>
              <img
                className="w-14 h-20 object-contain cursor-pointer"
                src={logo}
                alt="logo"
              />
            </div>

            <p>{format(new Date(), 'dd/MM/yyy')}</p>
          </div>
        </nav>
      </div>
      <div className="px-6 w-full md:w-1/2 mt-24">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-8  flex flex-col bg-white p-16 shadow-lg rounded-lg"
        >
          <h1 className="text-2xl font-bold flex justify-center">
            Verify Student&apos;s Certificate
          </h1>
          <p className="text-sm italic">
            An email with the verification status will be sent to you once the
            certificate details are verified.
          </p>
          <div className="flex flex-col space-y-1 w-full">
            <label>Enter your Name</label>
            <input
              {...register('initiator_name')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.initiator_name ? 'border-red-600' : ''
              }`}
            />
            {errors.initiator_name && (
              <span className="text-red-600 text-xs mt-2">
                {errors.initiator_name?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label>Enter your email address</label>
            <input
              {...register('initiator_email')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.initiator_email ? 'border-red-600' : ''
              }`}
            />
            {errors.initiator_email && (
              <span className="text-red-600 text-xs mt-2">
                {errors.initiator_email?.message}
              </span>
            )}
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <button
              type="submit"
              className="bg-claret-500 text-white w-full text-xs rounded-md py-2 mb-8"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default VerifiyCert;
