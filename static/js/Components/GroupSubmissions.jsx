import React, { useMemo, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EditIcon from '@mui/icons-material/Edit';
import TableWrapper from '../utils/TableWrapper';
import Modal from './Modal';
import P2PReviewsDetails from './P2PReviewsDetails';
import EditGroupAssignmentSubmission from './EditGroupAssignmentSubmission';
import ViewAssignmentSolution from './ViewAssignmentSolution';
import useFetchDataV2 from '../hooks/useFetchDataV2';
import Spinner from './spinner/Spinner';

// Define cell components as function components

function RatingCell({ row }) {
  return row.avg_rating ? (
    <Rating
      size="small"
      className="text-xs"
      name="read-only"
      value={row?.avg_rating}
      readOnly
      precision={0.5}
    />
  ) : (
    <p>No ratings yet</p>
  );
}

function SubmissionUrlCell({ row }) {
  return (
    <a href={row?.submission_url} download="file">
      <button
        type="button"
        className=" text-blue-500 px-3 py-1 rounded-md text-xs"
      >
        {row.submission_url}
      </button>
    </a>
  );
}

function ReviewsButton({ row, onClick }) {
  return (
    <button
      className={`bg-persian-500 px-4 py-1 rounded-md text-white text-sm cursor-pointer hover:bg-persian-700 space-x-1 flex items-center `}
      type="button"
      onClick={() => onClick(row)}
    >
      <RateReviewIcon className="inherit" />
      <p>View Reviews</p>
    </button>
  );
}

function EditButton({ row, onClick }) {
  return (
    <button
      className={`bg-claret-500 px-4 py-1 rounded-md text-white text-sm cursor-pointer hover:bg-claret-700 space-x-1 flex items-center `}
      type="button"
      onClick={() => onClick(row)}
    >
      <EditIcon className="inherit" />
      <p>Edit</p>
    </button>
  );
}

function StepByStepSolution({ row, onClick }) {
  return (
    <button
      className={`bg-persian-500 px-4 py-1 rounded-md text-white text-sm cursor-pointer hover:bg-persian-600 space-x-1 flex items-center `}
      type="button"
      onClick={() => onClick(row)}
    >
      <AssignmentTurnedInIcon className="inherit" />
      <p>Step by Step Solution</p>
    </button>
  );
}

function GroupSubmissions() {
  const { groupId } = useParams();

  const [viewReviewsModalOpen, setViewReviewsModalOpen] = useState(false);
  const [
    editGroupAssignmentSubmissionModalOpen,
    setEditGroupAssignmentSubmissionModalOpen,
  ] = useState(false);
  const [viewAssignmentSolutionModalOpen, setViewAssignmentSolutionModalOpen] =
    useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  const toggleViewReviewsModal = useCallback(() => {
    setViewReviewsModalOpen((prev) => !prev);
  }, []);

  const toggleEditGroupAssignmentSubmissionModal = useCallback(() => {
    setEditGroupAssignmentSubmissionModalOpen((prev) => !prev);
  }, []);

  const toggleViewAssignmentSolutionModal = useCallback(() => {
    setViewAssignmentSolutionModalOpen((prev) => !prev);
  }, []);

  // Define accessor functions using the function components
  const accessorFnRating = useCallback((row) => <RatingCell row={row} />, []);
  const accessorFnUrl = useCallback(
    (row) => <SubmissionUrlCell row={row} />,
    []
  );
  const accessorFnReviews = useCallback(
    (row) => (
      <ReviewsButton
        row={row}
        onClick={(rowData) => {
          setSubmissionData(rowData);
          toggleViewReviewsModal();
        }}
      />
    ),
    [toggleViewReviewsModal]
  );

  const accessorFnEditAction = useCallback(
    (row) => (
      <EditButton
        row={row}
        onClick={(rowData) => {
          setSubmissionData(rowData);
          toggleEditGroupAssignmentSubmissionModal();
        }}
      />
    ),
    [toggleEditGroupAssignmentSubmissionModal]
  );

  const accessorFnStepByStepSolution = useCallback(
    (row) =>
      row?.assignment?.hasPseudocodeSolution && (
        <StepByStepSolution
          row={row}
          onClick={(rowData) => {
            setSubmissionData(rowData);
            toggleViewAssignmentSolutionModal();
          }}
        />
      ),
    [toggleViewAssignmentSolutionModal]
  );

  const { data: groupSubmissionsData, isLoading: isFetchingGroupSubmissions } =
    useFetchDataV2(
      ['group-submissions', groupId],
      '/group-submissions',
      { params: { group_id: groupId } },
      "Couldn't fetch group submissions. Please try again",
      !!groupId
    );

  const columns = useMemo(
    () => [
      {
        title: 'Topic',
        field: 'assignment.title',
      },
      {
        title: 'Average Rating',
        field: 'avg_rating',
        render: accessorFnRating,
      },
      {
        title: 'Submission Url',
        field: 'submission_url',
        render: accessorFnUrl,
      },
      {
        title: 'Peer Reviews',
        field: 'peer_reviews',
        render: accessorFnReviews,
      },
      {
        title: 'Actions',
        field: 'actions',
        render: accessorFnEditAction,
      },
      {
        title: 'Step by Step Solution',
        field: 'pseudocodeSolution',
        render: accessorFnStepByStepSolution,
      },
    ],
    [
      accessorFnRating,
      accessorFnUrl,
      accessorFnReviews,
      accessorFnEditAction,
      accessorFnStepByStepSolution,
    ]
  );

  return (
    <>
      <div className="mt-4 text-xs md:text-lg">
        {isFetchingGroupSubmissions ? (
          <Spinner />
        ) : (
          <TableWrapper
            title="Group Assignments Submissions"
            columns={columns}
            data={
              groupSubmissionsData?.data?.group_assignment_submissions || []
            }
          />
        )}
      </div>
      <Modal
        modalOpen={viewReviewsModalOpen}
        toggleModal={toggleViewReviewsModal}
        title={`${submissionData?.group?.name} ${submissionData?.assignment?.title} Submission Reviews`}
      >
        <P2PReviewsDetails
          submissionData={submissionData}
          toggleModal={toggleViewReviewsModal}
        />
      </Modal>
      <Modal
        modalOpen={editGroupAssignmentSubmissionModalOpen}
        toggleModal={toggleEditGroupAssignmentSubmissionModal}
        title={`Edit ${submissionData?.assignment?.title} Submission`}
      >
        <EditGroupAssignmentSubmission
          submissionData={submissionData}
          groupId={submissionData?.group?.id}
          toggleModal={toggleEditGroupAssignmentSubmissionModal}
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

export default GroupSubmissions;
