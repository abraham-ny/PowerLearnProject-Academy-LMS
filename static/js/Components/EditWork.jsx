/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm, Controller, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Select from 'react-select';
import Spinner from './spinner/Spinner';
import useMutateData from '../hooks/useMutateData';
// import useFetchData from '../hooks/useFetchData';
import Modal from './Modal';
// import { updateDetailsWithPercentage } from '../features/auth/authSlice';
// import { axiosInterceptor } from '../utils/Axios/axiosInterceptor';
import countryOptions from '../utils/constants/countryOptions';

// get current date
const today = new Date();

// validation schema for edit work
const schema = yup.object({
  organisation: yup.string().required(),
  position: yup.string().required(),
  is_current: yup.bool(),
  start_date: yup
    .date()
    .max(new Date(), 'Start date cannot be after today')
    .required('Start date is required'),
  end_date: yup.mixed().when(['is_current'], {
    is: false,
    then: yup
      .date()
      .required('Date is required')
      .typeError('End date must be a valid date')
      .min(yup.ref('start_date'), 'End date cannot be before start date')
      .max(today, 'End date cannot be after today'),
    otherwise: yup.string().nullable().default(null),
  }),
  city: yup.string().required('This is a required field'),
  country: yup.string().required('This is a required field'),
});

const dateString = '2023-04-04 21:00:00 +0000 UTC';

function EditWork({
  toggleModal,
  workId,
  userId,
  organisation,
  position,
  end,
  start,
  curr,
  isDeletingWork,
  deleteWork,
  city,
  country,
}) {
  const date = new Date(start);
  const date_end = end !== null ? new Date(end) : null;

  const year = date.getUTCFullYear();
  const month = `0${date.getUTCMonth() + 1}`.slice(-2);
  const day = `0${date.getUTCDate()}`.slice(-2);

  const year_end = date_end !== null && date_end.getUTCFullYear();
  const month_end =
    date_end !== null && `0${date_end.getUTCMonth() + 1}`.slice(-2);
  const day_end = date_end !== null && `0${date_end.getUTCDate()}`.slice(-2);

  const formattedDate = `${year}-${month}-${day}`;
  const formattedEndDate =
    date_end !== null ? `${year_end}-${month_end}-${day_end}` : null;

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      organisation: organisation || null,
      position: position || null,
      end_date: formattedEndDate || null,
      // eslint-disable-next-line no-use-before-define
      start_date: formattedDate || null,
      is_current: curr || false,
      city: city || null,
      country: country || null,
    },
  });

  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restCountryField
    },
  } = useController({ name: 'country', control });

  const [deleteWorkModal, setDeleteWorkModal] = useState(false);
  const [endDate, setEndDate] = useState(null);

  const isCurrent = watch('is_current');

  const handleEndDateChange = (e) => {
    // eslint-disable-next-line no-unused-expressions
    if (endDate === '') {
      setEndDate(null);
    } else {
      setEndDate(new Date(e.target.value));
    }
  };

  const toggleDeleteWork = () => {
    setDeleteWorkModal(!deleteWorkModal);
  };

  const [current, setCurent] = useState(curr || false);

  const handleChange = (event) => {
    setCurent(event.target.checked);
  };

  // work experience mutation
  const { mutate: addWork, isLoading: isPostingWork } = useMutateData({
    url: `/students/work-experience/${workId}`,
    method: 'PUT',
    onSuccessfullMutation: toggleModal,
    onError: toggleModal,
    successMessage: 'Work experience updated successfully',
    errorMessage: "Couldn't update work experience, try again later!",
    queryKeysToInvalidate: [['user-details', userId]],
  });

  const onSubmit = async (requestData) => {
    const requestBody = {
      ...requestData,
      end_date: endDate === '' ? null : requestData.end_date,
    };

    addWork(requestBody);
  };

  const onDeleteWork = () => {
    deleteWork();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-gray-700 space-y-2"
      >
        <div className="space-y-6">
          <div className="flex flex-col space-y-1">
            <label>Organisation</label>
            <input
              {...register('organisation')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.organisation ? 'border-red-600' : ''
              }`}
            />
            {errors.organisation && (
              <span className="text-red-600 text-xs mt-2">
                {errors.organisation?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Position</label>
            <input
              {...register('position')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.position ? 'border-red-600' : ''
              }`}
            />
            {errors.position && (
              <span className="text-red-600 text-xs mt-2">
                {errors.position?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>City</label>
            <input
              {...register('city')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.city ? 'border-red-600' : ''
              }`}
            />
            {errors.city && (
              <span className="text-red-600 text-xs mt-2">
                {errors.city?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Country</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isClearable
                  className="react-dropdown"
                  classNamePrefix="dropdown"
                  options={countryOptions}
                  value={
                    countryValue
                      ? countryOptions.find((x) => x.value === countryValue)
                      : countryValue
                  }
                  onChange={(option) =>
                    countryOnChange(option ? option.value : option)
                  }
                  getOptionLabel={(option) => option.label}
                  {...restCountryField}
                />
              )}
            />
            {errors.country && (
              <span className="text-red-600 text-xs mt-2">
                {errors.country?.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label>Start Date</label>
            <input
              type="date"
              {...register('start_date')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.start_date ? 'border-red-600' : ''
              }`}
            />
            {errors.start_date && (
              <span className="text-red-600 text-xs mt-2">
                {errors.start_date?.message}
              </span>
            )}
          </div>
          <div className="flex flex-row space-x-4">
            <input
              type="checkbox"
              onChange={handleChange}
              defaultChecked={curr}
              {...register('is_current')}
              className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                errors.is_current ? 'border-red-600' : ''
              }`}
            />
            <label>Are you currently working here?</label>
            {errors.is_current && (
              <span className="text-red-600 text-xs mt-2">
                {errors.is_current?.message}
              </span>
            )}
          </div>
          {!isCurrent && (
            <div className="flex flex-col space-y-1">
              <label>End Date</label>
              <input
                type="date"
                {...register('end_date')}
                onChange={handleEndDateChange}
                className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
                  errors.end_date ? 'border-red-600' : ''
                }`}
              />

              {errors.end_date && (
                <span className="text-red-600 text-xs mt-2">
                  {errors.end_date?.message}
                </span>
              )}
            </div>
          )}
          <div className=" flex justify-between mt-8">
            <button
              type="button"
              onClick={() => {
                toggleDeleteWork();
              }}
              className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
            >
              {' '}
              <CancelIcon fontSize="inherit" />
              Delete Work
            </button>
            {isPostingWork ? (
              <div className="flex justify-center items-center h-10">
                <Spinner />
              </div>
            ) : (
              <button
                type="submit"
                className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
              >
                <SaveIcon fontSize="inherit" />
                Save Work
              </button>
            )}
          </div>
        </div>
      </form>
      <Modal
        title="Delete Work Entry"
        modalOpen={deleteWorkModal}
        toggleModal={toggleDeleteWork}
      >
        <p>Are you sure you want to delete?</p>
        {isDeletingWork ? (
          <Spinner />
        ) : (
          <div className=" flex justify-between mt-8">
            <button
              className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
              type="button"
              onClick={toggleDeleteWork}
            >
              <CancelIcon fontSize="inherit" />
              <p>Cancel</p>
            </button>
            <button
              className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
              type="button"
              onClick={() => {
                onDeleteWork();
                toggleDeleteWork();
                toggleModal();
              }}
            >
              <SaveIcon fontSize="inherit" />
              <p>Delete Work</p>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EditWork;
