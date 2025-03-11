import React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Spinner from './spinner/Spinner';
import useMutateData from '../hooks/useMutateData';

const schema = yup
  .object({
    remarks: yup
      .string()
      .required('This is a required field')
      .max(1000, 'Title should be less than 1000 characters'),
    rating: yup
      .number()
      .min(1, "Rating can't be less than 1")
      .max(5, "Rating can't be more than 5"),
  })
  .required();

function AddReview({ toggleModal, submissionId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { groupId } = useParams();

  const onAddReviewSuccess = () => {
    toggleModal();
  };

  const { mutate: addReview, isLoading } = useMutateData({
    url: '/group-submissions/review',
    onSuccessfullMutation: onAddReviewSuccess,
    successMessage: 'Review successfully added!',
    errorMessage: 'Failed to add review! Please try again',
    queryKeysToInvalidate: [['exclude-group-submissions', groupId]],
  });

  const onSubmit = async (data) => {
    const requestBody = {
      ...data,
      group_assignment_submission_id: submissionId,
    };
    addReview(requestBody);
  };

  return (
    <form className="text-gray-700 space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-1">
        <label htmlFor="rating" className="">
          Rating
        </label>
        <input
          {...register('rating', { required: true })}
          type="number"
          max={5}
          id="rating"
          placeholder="rating"
          className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
            errors.rating ? 'border-red-600' : ''
          }`}
        />
        {errors.rating && (
          <span className="text-red-600 text-xs mt-2">
            {errors.rating?.message}
          </span>
        )}
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="remarks" className="text-base">
          Remarks
        </label>
        <textarea
          {...register('remarks', { required: true })}
          type="text"
          id="remarks"
          placeholder="remarks"
          className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
            errors.remarks ? 'border-red-600' : ''
          }`}
        />
        {errors.remarks && (
          <span className="text-red-600 text-xs mt-2">
            {errors.remarks?.message}
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="w-full flex align-middle justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className=" flex justify-between mt-8">
          <button
            className={`border-[1px] border-claret-500 px-4 py-1 rounded-md text-claret-500 text-sm space-x-2 flex items-center `}
            type="button"
            onClick={toggleModal}
          >
            <CancelIcon fontSize="inherit" />
            <p>Cancel</p>
          </button>
          <button
            className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center `}
            type="submit"
          >
            <SaveIcon fontSize="inherit" />
            <p>Add Review</p>
          </button>
        </div>
        // <div className=" mt-2 flex justify-between">
        //   <div className="">
        //     <button
        //       className="bg-[#57C13E] px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center"
        //       type="submit"
        //     >
        //       <SaveIcon fontSize="inherit" />
        //       <p>Add Review</p>
        //     </button>
        //   </div>
        //   <div className="">
        //     <button
        //       className="bg-[#8B173B] px-4 py-1 rounded-md text-white text-sm space-x-2 flex items-center"
        //       type="button"
        //       onClick={toggleModal}
        //     >
        //       <HighlightOffIcon fontSize="inherit" />
        //       <p>Cancel</p>
        //     </button>
        //   </div>
        // </div>
      )}
    </form>
  );
}

export default AddReview;
