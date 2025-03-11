/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TableWrapper from '../utils/TableWrapper';
import Spinner from './spinner/Spinner';
import useFetchDataV2 from '../hooks/useFetchDataV2';

function GroupAssignments() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Topic',
      field: 'title',
    },
    {
      title: 'Due Date',
      field: 'deadline',
      render: (row) => <p>{new Date(row.deadline).toLocaleDateString()}</p>,
    },
    {
      title: 'Actions',
      render: (row) => (
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/group/${groupId}/assignments/${row.id}`)}
            type="button"
            className="p-1 px-2 bg-[#00999E] text-white rounded-md"
          >
            View Assignment
          </button>
        </div>
      ),
    },
  ];

  const { data: groupAssignmentsData, isLoading: isFetchingGroupAssignments } =
    useFetchDataV2(
      ['group-assignments', groupId],
      `/group-assignments/${groupId}`,
      {},
      "Couldn't get group assignments. Please try again!",
      !!groupId
    );

  return (
    <div className="mt-4 text-xs md:text-lg">
      {isFetchingGroupAssignments ? (
        <Spinner />
      ) : (
        <TableWrapper
          title="Group Assignments"
          columns={columns}
          data={groupAssignmentsData?.data?.group_assignment?.assignments || []}
        />
      )}
    </div>
  );
}

export default GroupAssignments;
