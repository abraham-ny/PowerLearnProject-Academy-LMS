/* eslint-disable react/jsx-filename-extension */
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumIcon from '@mui/icons-material/Forum';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AlarmIcon from '@mui/icons-material/Alarm';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import SmartToyIcon from '@mui/icons-material/SmartToy';
// import SupportIcon from '@mui/icons-material/HeadsetMic';

const SidebarData = [
  { id: 1, title: 'My Learning', icon: <DashboardIcon />, link: '/' },
  {
    id: 2,
    title: 'Dashboard',
    icon: <DashboardCustomizeOutlinedIcon />,
    link: '/dashboard',
  },
  {
    id: 4,
    title: 'Class Sessions',
    icon: <CalendarMonthIcon />,
    link: '/class-sessions',
  },
  { id: 5, title: 'Submissions', icon: <AlarmIcon />, link: '/submissions' },
  { id: 6, title: 'Groups', icon: <GroupsIcon />, link: '/groups' },
  { id: 7, title: 'Community', icon: <ForumIcon />, link: '/my-community' },
  { id: 8, title: 'Gemini AI', icon: <SmartToyIcon />, link: '/ai-chat' },
  {
    id: 9,
    title: 'Certificates',
    icon: <ArticleIcon />,
    link: '/certificates',
  },
  // {
  //   id: 10,
  //   title: 'Support Tickets',
  //   icon: <SupportIcon />,
  //   link: '/support-tickets',
  // },
];

export default SidebarData;
