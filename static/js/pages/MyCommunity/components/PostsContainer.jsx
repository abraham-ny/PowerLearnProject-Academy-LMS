import React from 'react';

import InfoIcon from '@mui/icons-material/Info';
import Spinner from '../../../Components/spinner/Spinner';
import CommunityPostItem from '../../../Components/community/CommunityPostItem';

const PostsContainer = ({
  isLoadingPosts,
  posts,
  page,
  setPage,
  pageLimit,
  totalPosts,
}) => {
  const maxPostsExpected = page * pageLimit;

  return (
    <div>
      {isLoadingPosts && (!posts || posts.length === 0) ? (
        <Spinner />
      ) : (
        <div>
          {posts.length > 0 ? (
            <>
              {posts?.map((post) => (
                <CommunityPostItem key={post.id} post={post} page={page} />
              ))}
              {/* posts navigation */}
              <div className="w-full py-5 flex justify-between max-w-xl mx-auto">
                <div>
                  {page !== 1 ? (
                    <button
                      type="button"
                      onClick={() => setPage(page - 1)}
                      className="border border-claret-500 text-claret-500 rounded-md px-5"
                    >
                      Previous
                    </button>
                  ) : null}
                </div>
                {totalPosts > maxPostsExpected ? (
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    className="border border-claret-500 text-claret-500 rounded-md px-5"
                  >
                    Next
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-x-1 py-10 text-sm">
              <InfoIcon className="text-orange-300" />
              No Posts yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostsContainer;
