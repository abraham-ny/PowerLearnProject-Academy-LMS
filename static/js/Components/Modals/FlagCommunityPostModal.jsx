import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Spinner from '../spinner/Spinner';
import { communityInterceptor } from '../../utils/Axios/communityInterceptor';

function FlagCommunityPost({ toggleModal, postId }) {
  const onFlagSuccess = () => {
    toast.success('Post reported. We will review it.');
    toggleModal();
  };

  const onFlagError = () => {
    toast.error("Couldn't delete post. Please try again.");
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (values) => {
      return communityInterceptor.put(`/posts/flag/${postId}`, values);
    },
    onSuccess: onFlagSuccess,
    onError: onFlagError,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = (values) => {
    mutate(values);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="flex flex-col space-y-1">
        <label className="font-roboto font-light">
          {' '}
          Please enter a reason for reporting this post
        </label>
        <textarea
          {...register('reason', { required: 'Please enter a reason' })}
          className={`border-[#CBCBCB] border-[1px] px-2 py-2 rounded-lg focus:outline-none ${
            errors.reason ? 'border-red-600' : ''
          }`}
          rows={4}
          placeholder="Enter reason for reporting this post"
        />
        {errors.reason && (
          <span className="text-red-600 text-xs mt-2">
            {errors.reason?.message}
          </span>
        )}
      </div>
      {isLoading ? (
        <Spinner />
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
            <DeleteIcon fontSize="inherit" />
            <p>Report Post</p>
          </button>
        </div>
      )}
    </form>
  );
}

export default FlagCommunityPost;
