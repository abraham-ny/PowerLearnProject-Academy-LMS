import React from 'react';

import PostsContainer from './PostsContainer';
import useFetchCommunityData from '../../../hooks/useFetchCommunityData';

const MyPosts = ({ pageLimit, page, setPage }) => {
  const postSkipped = pageLimit * (page - 1);

  const { data, isLoading: isLoadingMyPosts } = useFetchCommunityData(
    ['my-posts', page],
    '/posts/me',
    { params: { $limit: pageLimit, $skip: postSkipped } },
    "Couldn't get posts. Please try again",
    page
  );

  return (
    <PostsContainer
      isLoadingPosts={isLoadingMyPosts}
      posts={data?.data?.posts || []}
      page={page}
      setPage={setPage}
      pageLimit={pageLimit}
      totalPosts={data?.data?.total || 0}
    />
  );
};

export default MyPosts;
