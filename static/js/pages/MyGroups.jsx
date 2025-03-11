/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumbs } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, NavigateNext } from '@mui/icons-material';
import MainContent from '../Components/MainContent';
import CommonTopTab from '../Components/CommonTopTab';
import TableWrapper from '../utils/TableWrapper';
import useFetchDataV2 from '../hooks/useFetchDataV2';
import Spinner from '../Components/spinner/Spinner';

function MyGroups() {
  const navigate = useNavigate();
  const student_id = useSelector((state) => state.auth.userDetails.id);

  const { data: studentGroupsData, isLoading: isFetchingStudentGroupsData } =
    useFetchDataV2(
      ['group-members', student_id],
      '/group-members',
      { params: { student_id } },
      "Couldn't get your groups. Please try again!",
      student_id
    );

  const columns = [
    {
      title: 'Group Name',
      field: 'group.name',
      render: (row) => (
        <p
          onClick={() => navigate(`/groups/${row?.group?.id}`)}
          className="cursor-pointer"
        >
          {row?.group?.name}
        </p>
      ),
    },
  ];

  return (
    <MainContent full>
      <CommonTopTab>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext />}>
          <NavLink
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            to="/"
            className="flex items-center"
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </NavLink>
        </Breadcrumbs>
      </CommonTopTab>
      <div className="mt-5 text-xs md:text-lg">
        {isFetchingStudentGroupsData ? (
          <Spinner />
        ) : (
          <TableWrapper
            title="My Groups"
            columns={columns}
            data={studentGroupsData?.data?.group_members || []}
          />
        )}
      </div>
    </MainContent>
  );
}

export default MyGroups;
