/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { useParams } from 'react-router-dom';
import TableWrapper from '../utils/TableWrapper';
import useFetchDataV2 from '../hooks/useFetchDataV2';
import Spinner from './spinner/Spinner';

const columns = [
  {
    title: 'First Name',
    field: 'student.firstname',
    render: (row) => <p className="capitalize">{row?.student?.firstname}</p>,
  },
  {
    title: 'Last Name',
    field: 'student.lastname',
    render: (row) => <p className="capitalize">{row?.student?.lastname}</p>,
  },
  {
    title: 'Email',
    field: 'student.email',
  },
  {
    title: 'Github',
    field: 'user.github_account',
    render: (row) =>
      row?.user?.github_account ? (
        <a
          href={row?.user?.github_account}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500"
        >
          View Github Profile
        </a>
      ) : (
        <p>N/A</p>
      ),
  },
  {
    title: 'Nationality',
    field: 'student.country',
  },
];

function GroupMembers() {
  const { groupId } = useParams();

  const { data: groupMembersData, isLoading: isFetchingGroupMembersData } =
    useFetchDataV2(
      ['group-members', groupId],
      '/group-members',
      { params: { group_id: groupId } },
      "Couldn't get group members. Please try again!",
      !!groupId
    );

  return (
    <div>
      <div className="mt-4 text-xs md:text-lg">
        {isFetchingGroupMembersData ? (
          <Spinner />
        ) : (
          <TableWrapper
            title="Group Members"
            columns={columns}
            data={groupMembersData?.data?.group_members || []}
          />
        )}
      </div>
    </div>
  );
}

export default GroupMembers;
