/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumbs } from '@mui/material';
import { Home, NavigateNext } from '@mui/icons-material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditIcon from '@mui/icons-material/Edit';
import { NavLink } from 'react-router-dom';
import MainContent from '../Components/MainContent';
import TableWrapper from '../utils/TableWrapper';
import RightBar from '../Components/RightBar';
import Calendar from '../Components/calendar/Calendar';
import CommonTopTab from '../Components/CommonTopTab';
import Modal from '../Components/Modal';
import EditStudentAssignmentSubmission from '../Components/EditStudentAssignmentSubmission';
import ViewAssignmentSolution from '../Components/ViewAssignmentSolution';
import useFetchDataV2 from '../hooks/useFetchDataV2';
import Spinner from '../Components/spinner/Spinner';

function MyAssignmentSubmissions() {
  const [editSubmissionModalOpen, setEditSubmissionModalOpen] = useState(false);
  const [viewAssignmentSolutionModalOpen, setViewAssignmentSolutionModalOpen] =
    useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  const toggleEditSubmissionModal = useCallback(() => {
    setEditSubmissionModalOpen((prev) => !prev);
  }, []);

  const toggleViewAssignmentSolutionModal = useCallback(() => {
    setViewAssignmentSolutionModalOpen((prev) => !prev);
  }, []);

  const student_id = useSelector((state) => state?.auth?.userDetails?.id);

  const columns = useMemo(
    () => [
      {
        title: 'Assignment name',
        field: 'assignment.title',
      },
      {
        title: 'Submission Url',
        field: 'submission_url',
        render: (row) => (
          <a
            href={row?.submission_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500"
          >
            {row?.submission_url}
          </a>
        ),
      },
      {
        title: 'Actions',
        render: (row) => (
          <div className="flex justify-between gap-4">
            <button
              className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm cursor-pointer hover:bg-claret-600 space-x-1 flex items-center `}
              type="button"
              onClick={() => {
                setSubmissionData(row);
                toggleEditSubmissionModal();
              }}
            >
              <EditIcon className="inherit" />
              <p>Edit</p>
            </button>
            {row?.assignment?.hasPseudocodeSolution && (
              <button
                className={`bg-persian-500 px-4 py-1 rounded-md text-white text-sm cursor-pointer hover:bg-persian-600 space-x-1 flex items-center `}
                type="button"
                onClick={() => {
                  setSubmissionData(row);
                  toggleViewAssignmentSolutionModal();
                }}
              >
                <AssignmentTurnedInIcon className="inherit" />
                <p>Step by Step Solution</p>
              </button>
            )}
          </div>
        ),
      },
    ],
    [toggleEditSubmissionModal, toggleViewAssignmentSolutionModal]
  );

  const {
    data: studentAssignmentSubmissionsData,
    isLoading: isFetchingStudentAssignmentSubmissionsData,
  } = useFetchDataV2(
    ['student-assignment-submission', student_id],
    `/student-assignment-submission/filter-by-student-id/${student_id}`,
    {},
    "Couldn't get your assigments submissions. Try again later",
    !!student_id
  );

  return (
    <>
      <MainContent>
        <CommonTopTab>
          <Breadcrumbs aria-label="breadcrumbs" separator={<NavigateNext />}>
            <NavLink to="/" className="flex items-center">
              <Home />
              Home
            </NavLink>
            <NavLink to="/submissions">Submissions</NavLink>
          </Breadcrumbs>
        </CommonTopTab>
        <div className="bg-white mt-4 rounded text-xs md:text-lg">
          {isFetchingStudentAssignmentSubmissionsData ? (
            <Spinner />
          ) : (
            <TableWrapper
              title="Assignment Submissions"
              columns={columns}
              data={studentAssignmentSubmissionsData?.data?.submissions || []}
            />
          )}
        </div>
      </MainContent>
      <RightBar>
        <Calendar />
      </RightBar>
      <Modal
        modalOpen={editSubmissionModalOpen}
        toggleModal={toggleEditSubmissionModal}
        title={`Edit ${submissionData?.assignment?.title} Submission`}
      >
        <EditStudentAssignmentSubmission
          submissionData={submissionData}
          studentId={student_id}
          toggleModal={toggleEditSubmissionModal}
        />
      </Modal>
      <Modal
        modalOpen={viewAssignmentSolutionModalOpen}
        toggleModal={toggleViewAssignmentSolutionModal}
        title={`${submissionData?.assignment?.title} Step By Step Solution`}
      >
        <ViewAssignmentSolution
          assignmentId={submissionData?.assignment?.id}
          toggleModal={toggleViewAssignmentSolutionModal}
        />
      </Modal>
    </>
  );
}

export default MyAssignmentSubmissions;
