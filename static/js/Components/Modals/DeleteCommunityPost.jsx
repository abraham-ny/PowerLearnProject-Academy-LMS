import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Spinner from '../spinner/Spinner';
import { communityInterceptor } from '../../utils/Axios/communityInterceptor';

function DeleteCommunityPost({ toggleModal, post }) {
  const queryClient = useQueryClient();

  const onDeleteSuccess = async () => {
    // clear all community-posts queries
    await queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    await queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    toast.success('Post successfully deleted');
    toggleModal();
  };

  const onDeleteError = () =>
    toast.error("Couldn't delete post. Please try again.");

  const { mutate, isLoading } = useMutation({
    mutationFn: () => {
      return communityInterceptor.delete(`/posts/${post.id}/student`);
    },
    onSuccess: onDeleteSuccess,
    onError: onDeleteError,
  });

  return (
    <>
      <p>Are you sure you want to delete this post?</p>
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
            type="button"
            onClick={() => {
              mutate();
            }}
          >
            <DeleteIcon fontSize="inherit" />
            <p>Delete Post</p>
          </button>
        </div>
      )}
    </>
  );
}

export default DeleteCommunityPost;
