/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Controller, useController, useForm } from 'react-hook-form';
import BugReportIcon from '@mui/icons-material/BugReport';
import CancelIcon from '@mui/icons-material/Cancel';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { useQuill } from 'react-quilljs';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
// import useFetchData from '../hooks/useFetchData';

// {
//   "description": "Cannot access my courses",
//   "subject": "LEARNING ISSUE ON MY END",
//   "type": "LEARNING_ISSUE",
//   "user_email": "briansammy1997@gmail.com",
//   "user_full_name": "Sammy Brian",
//   "user_phone_number": "+254795972875"

// enum TicketTypeEnum {
//     LOGIN_ISSUE
//     LEARNING_ISSUE
//     PROGRESS_ISSUE
//     ONBOARDING_ISSUE
// }
// }

const baseURL =
  process.env.REACT_APP_BASE_URL ||
  'https://api.lms.v2.powerlearnprojectafrica.org/gateway/api';

const ticketOptions = [
  {
    label: 'Login Issue',
    value: 'LOGIN_ISSUE',
  },
  {
    label: 'Live Classes Issue',
    value: 'LIVE_CLASSES_ISSUE',
  },
  {
    label: 'Content Issue',
    value: 'CONTENT_ISSUE',
  },
  {
    label: 'Progress Issue',
    value: 'PROGRESS_ISSUE',
  },
  {
    label: 'Certificate Issue',
    value: 'CERTIFICATE_ISSUE',
  },
  {
    label: 'Payment Issue',
    value: 'PAYMENT_ISSUE',
  },
  {
    label: 'Advanced Courses Enrollment Issue',
    value: 'ADVANCED_COURSES_ENROLLMENT_ISSUE',
  },
];

const schema = yup
  .object({
    user_full_name: yup.string().required('Please enter your name'),
    user_email: yup
      .string()
      .email('Please enter a valid emailaddress')
      .required('Please enter your email address'),
    subject: yup.string().required('This is a required field'),
    type: yup.string().required('Please select a category'),
    user_phone_number: yup
      .string()
      .required('This is a required field')
      .test('is valid', 'Please enter a valid phone number', (value) =>
        isValidPhoneNumber(value || '')
      ),

    // message: yup.string().required('This is a required field'),
    // is_bulk: yup.string().nullable().required('Please select grouping option'),
  })
  .required();

function CreateTicket({ toggleModal }) {
  const [description, setDescription] = useState('');

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [['bold', 'italic', 'underline'], ['image'], ['clean']],
      clipboard: {
        matchVisual: false,
      },
    },
    placeholder: 'Please explain your issue in as much detail as possible',
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restLevelField
    },
  } = useController({ name: 'type', control });

  const queryClient = useQueryClient();

  const isBodyEmpty = description === '<p><br></p>' || description === '';
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setDescription(quill.root.innerHTML);
      });
    }
  }, [quill, quillRef]);

  const onCreateTicketSuccess = () => {
    toast.success('Issue raised. We will look into it.');
    toggleModal();
    queryClient.invalidateQueries(['student-support-tickets']);
  };

  const onCreateTicketFailure = () => {
    toast.error("Couldn't raise issue. Please try again!");
  };

  const { mutate, isLoading } = useMutation(
    (data) => {
      return axios.post(`${baseURL}/support/tickets`, data);
    },
    {
      onSuccess: onCreateTicketSuccess,
      onError: onCreateTicketFailure,
    }
  );

  const onSubmit = async (requestData) => {
    const formattedData = {
      ...requestData,
      description,
    };
    mutate(formattedData);
  };
  return (
    <form className="text-gray-700 space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="align-middle space-y-2">
        <div className="flex flex-col space-y-1">
          <label htmlFor="subject" className="text-base">
            Name
          </label>
          <input
            {...register('user_full_name', { required: true, max: 15 })}
            type="text"
            id="user_full_name"
            placeholder="Please enter your full name"
            className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
              errors.user_full_name ? 'border-red-600' : ''
            }`}
          />
          {errors.user_full_name && (
            <span className="text-red-600 text-xs mt-2">
              {errors.user_full_name?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="subject" className="text-base">
            Email
          </label>
          <input
            {...register('user_email', { required: true })}
            type="user_email"
            id="user_email"
            placeholder="Please enter you email address"
            className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
              errors.user_email ? 'border-red-600' : ''
            }`}
          />
          {errors.user_email && (
            <span className="text-red-600 text-xs mt-2">
              {errors.user_email?.message}
            </span>
          )}
        </div>
        <div className="mb-3 flex flex-col">
          <label htmlFor="user_phone_number" className="text-base">
            Phone Number
          </label>
          <PhoneInputWithCountry
            defaultValue=""
            className={`${
              errors && errors.user_phone_number
                ? 'border-red-500'
                : 'border-primary-teal'
            } rounded-md border-[1px] py-2  pl-2`}
            name="user_phone_number"
            control={control}
            rules={{ required: true }}
            defaultCountry="KE"
            international
          />
          {errors && errors.user_phone_number && (
            <small className="text-red-500">
              {errors.user_phone_number.message}
            </small>
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="type" className="text-base">
            What Kind of Issue Are You Facing?
          </label>
          <select
            {...register('type')}
            className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg caret-claret-500 focus:outline-none ${
              errors.type ? 'border-red-600' : ''
            }`}
            name="type"
            id="type"
          >
            <option className="px-2 text-lg textgr" value="">
              Please select a category
            </option>
            {ticketOptions.map((ticketOption) => (
              <option
                className="px-2 text-lg"
                key={ticketOption.value}
                value={ticketOption.value}
              >
                {ticketOption.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <span className="text-red-600 text-xs">{errors.type?.message}</span>
          )}
        </div>
        <div className="flex flex-col space-y-1 col-span-2">
          <label htmlFor="subject" className="text-base">
            Subject
          </label>
          <input
            {...register('subject', { required: true })}
            type="text"
            id="subject"
            placeholder="Subject"
            className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
              errors.subject ? 'border-red-600' : ''
            }`}
          />
          {errors.subject && (
            <span className="text-red-600 text-xs mt-2">
              {errors.subject?.message}
            </span>
          )}
        </div>
        <div className="grid col-span-2 mt-5">
          <p className="mb-3">Description</p>
          <div ref={quillRef} />
          {isBodyEmpty && (
            <span className="text-red-600 text-xs mt-2">
              Please describe the issue
            </span>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center mt-5">
          <Spinner />
        </div>
      ) : (
        <div className="flex justify-between mt-7">
          <button
            className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
            type="button"
            onClick={toggleModal}
          >
            <CancelIcon fontSize="inherit" />
            <p>Cancel</p>
          </button>
          <button
            className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center  ${
              isBodyEmpty || Object.keys(errors).length > 0
                ? 'bg-gray-400 cursor-not-allowed'
                : ''
            }`}
            type="submit"
            disabled={isBodyEmpty || Object.keys(errors).length > 0}
          >
            <BugReportIcon fontSize="inherit" />
            <p>Raise Issue</p>
          </button>
        </div>
      )}
    </form>
  );
}

export default CreateTicket;
