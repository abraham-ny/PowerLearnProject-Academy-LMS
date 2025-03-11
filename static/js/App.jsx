import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Spinner from './Components/spinner/Spinner';
import Login from './pages/userAuth/Login/Login';
import Profile from './pages/Profile';
import ForgotPassword from './pages/userAuth/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/userAuth/ResetPassword/ResetPassword';
import SetNewPassword from './pages/userAuth/ResetPassword/SetNewPassword';
import CertificatePage from './pages/CertificatePage';
import EditWorkExperience from './pages/EditWorkExperience';
import EditEducationalBackground from './pages/EditEducationalBackground';
import Landing from './Components/editor/Landing';
import VerifiyCert from './pages/VerifiyCert';
import LandingPage from './pages/LandingPage';
import ScholarshipPage from './pages/ScholarshipPage';
import ModuleDetail from './pages/ModuleDetail';
import MyDashboard from './pages/MyDashboard';
import MyProfile from './pages/MyProfile';
import Register from './pages/userAuth/Register/Register';
import MyCommunity from './pages/MyCommunity';
import CommunityPostItem from './Components/community/CommunityPostItem';
import SupportModal from './Components/SupportModal';
import MyAssignmentSubmissions from './pages/MyAssignmentSubmissions';
import AIChat from './pages/AIChat';

const StudentDash = lazy(() =>
  import('./pages/Dashboards/StudentDash/StudentDash')
);
const Courses = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Courses/Courses')
);
const Tutorials = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Tutorials/Tutorials')
);
const MyLearning = lazy(() => import('./pages/MyLearning/MyLearning'));
const Lessons = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Lessons/LessonTabs')
);
const QuizResults = lazy(() => import('./pages/QuizResults'));

const QuizResult = lazy(() => import('./pages/QuizResult'));
const Discussion = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Discussion')
);
const Messages = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Messages')
);
const Notifications = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Notifications')
);
const MyGroups = lazy(() => import('./pages/MyGroups'));
const MySubmissions = lazy(() => import('./pages/MySubmissions'));
const TutorialId = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Tutorials/TutorialId')
);
const DiscussionDetail = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/DiscussionDetail')
);
const GroupDetail = lazy(() => import('./pages/GroupDetail'));
const GroupAssignmentDetail = lazy(() =>
  import('./Components/GroupAssignmentDetail')
);

const StartQuiz = lazy(() => import('./pages/StartQuiz'));

const QuizFirstAttempt = lazy(() => import('./pages/QuizFirstAttempt'));

const QuizRetake = lazy(() => import('./pages/QuizRetake'));

const Survey = lazy(() => import('./pages/Dashboards/StudentDashPages/Survey'));

const WeeklyAssignment = lazy(() =>
  import('./pages/Dashboards/StudentDashPages/Assignments')
);

const CertificatesPage = lazy(() => import('./pages/CertificatesPage'));

const ModuleCheckout = lazy(() => import('./pages/ModuleCheckout'));

const ClassSessions = lazy(() => import('./pages/ClassSessions'));
const ClassSessionDetail = lazy(() => import('./pages/ClassSessionDetail'));
const JoinClassSession = lazy(() => import('./pages/JoinClassSession'));

const SupportTickets = lazy(() => import('./pages/SupportTickets'));

function App() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <Suspense
      fallback={
        <StudentDash>
          <div className="grid place-items-center">
            <Spinner />
          </div>
        </StudentDash>
      }
    >
      <div className="relative">
        <Routes>
          <Route path="/*" element={<ProtectedRoutes />}>
            <Route path="/*" element={<StudentDash />}>
              <Route path="" element={<MyLearning />} />
              <Route path="my-courses" element={<Courses />} />
              <Route path="tutorials" element={<Tutorials />} />

              <Route path="tutorials/:tutorialId" element={<TutorialId />} />
              <Route
                path="course-module/:moduleId/week/:weekId/quiz/:quizId"
                element={<StartQuiz />}
              />
              <Route
                path="course-module/:moduleId/week/:weekId/quiz/:quizId/firstAttempt"
                element={<QuizFirstAttempt />}
              />
              <Route
                path="course-module/:moduleId/week/:weekId/quiz/:quizId/retake"
                element={<QuizRetake />}
              />
              <Route
                path="course-module/:moduleId/surveys/:surveyId/week/:weekId"
                element={<Survey />}
              />
              <Route
                path="course-module/:moduleId/week/:weekId/assignments/:assignmentId"
                element={<WeeklyAssignment />}
              />
              <Route path="notifications" element={<Notifications />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route
                path="certificates/:cohortType/:cohortId"
                element={<CertificatePage />}
              />
              <Route path="user/:userId" element={<Profile />} />
              <Route
                path="user/:userId/update-workExperience"
                element={<EditWorkExperience />}
              />
              <Route
                path="user/:userId/update-educationalBackground"
                element={<EditEducationalBackground />}
              />
              <Route path="groups" element={<MyGroups />} />
              <Route path="submissions" element={<MySubmissions />} />
              <Route
                path="submissions/quiz-results"
                element={<QuizResults />}
              />
              <Route
                path="submissions/my-assignment-submissions"
                element={<MyAssignmentSubmissions />}
              />
              <Route
                path="submissions/quiz-results/:quizId/:resultId"
                element={<QuizResult />}
              />
              <Route path="dashboard" element={<MyDashboard />} />
              <Route path="my-profile" element={<MyProfile />} />
              <Route path="groups/:groupId" element={<GroupDetail />} />
              <Route
                path="group/:groupId/assignments/:assignmentId"
                element={<GroupAssignmentDetail />}
              />
              <Route path="messages" element={<Messages />} />
              <Route
                path="course-module/:moduleId/week/:weekId/lesson/:lessonId/discussion"
                element={<Discussion />}
              />
              <Route
                path="course-module/:moduleId/week/:weekId/lesson/:lessonId/discussion/:discussionId"
                element={<DiscussionDetail />}
              />
              <Route path="course-module/:moduleId" element={<Courses />} />
              <Route path="my-community/" element={<MyCommunity />} />
              <Route
                path="community-post/:postId"
                element={<CommunityPostItem />}
              />
              <Route path="class-sessions" element={<ClassSessions />} />
              <Route
                path="class-sessions/:classSessionId"
                element={<ClassSessionDetail />}
              />
              <Route
                path="class-sessions/:classSessionId/join/:zoomSessionID"
                element={<JoinClassSession />}
              />
              <Route path="ai-chat" element={<AIChat />} />
              <Route path="editor" element={<Landing />} />
              <Route
                path="course-module/:moduleId/checkout"
                element={<ModuleCheckout />}
              />
              <Route path="notifications" element={<Notifications />} />

              <Route
                path="course-module/:moduleId/week/:weekId/lesson/:lessonId"
                element={<Lessons />}
              />
              <Route path="support-tickets" element={<SupportTickets />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<Register />} />
          <Route path="/available-courses" element={<LandingPage />} />
          <Route path="/scholarship-courses" element={<ScholarshipPage />} />
          <Route path="/module/:moduleId" element={<ModuleDetail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/set-password/:token" element={<SetNewPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-cert/:studentId" element={<VerifiyCert />} />
        </Routes>
        <SupportModal />
      </div>
    </Suspense>
  );
}

export default App;
