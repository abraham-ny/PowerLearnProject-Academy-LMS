import React, { Fragment } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Tab } from '@headlessui/react';
import CommonTopTab from '../Components/CommonTopTab';
import GroupMembers from '../Components/GroupMembers';
import GroupAssignments from '../Components/GroupAssignments';
import GroupSubmissions from '../Components/GroupSubmissions';
import P2P from '../Components/P2P';
import MainContent from '../Components/MainContent';
import GroupChat from '../Components/GroupChat';
import useFetchDataV2 from '../hooks/useFetchDataV2';
import Spinner from '../Components/spinner/Spinner';

function GroupDetail() {
  const { groupId } = useParams();

  const { data: groupData, isLoading: isFetchingGroupData } = useFetchDataV2(
    ['groups', groupId],
    `/groups/${groupId}`,
    {},
    "Couldn't get group details. Please try again!",
    !!groupId
  );

  const tabs = [
    {
      title: 'Group Chat',
      component: <GroupChat />,
    },
    {
      title: 'Group Members',
      component: <GroupMembers />,
    },
    {
      title: 'Group Assignments',
      component: <GroupAssignments />,
    },
    {
      title: 'Group Submissions',
      component: <GroupSubmissions />,
    },
    {
      title: 'Peer-to-Peer Reviews',
      component: <P2P />,
    },
  ];
  return (
    <MainContent full>
      <div className="">
        <CommonTopTab>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon />}>
            <NavLink
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              to="/"
              className="flex items-center"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              <p>Home</p>
            </NavLink>
            <NavLink
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              to="/groups"
              className="flex items-center"
            >
              <p>My Groups</p>
            </NavLink>
          </Breadcrumbs>
        </CommonTopTab>
        <div className="flex flex-col gap-3 mt-3">
          {isFetchingGroupData ? (
            <Spinner />
          ) : (
            <div className="bg-white p-3">
              <h2 className="font-semibold text-xl text-center">
                Group Name: {groupData?.data?.group?.name}
              </h2>
            </div>
          )}
          <div className="p-2 bg-white">
            <Tab.Group>
              <Tab.List className=" flex space-x-12 flex-wrap extraLarge:grid sm:grid-cols-2 gap-4 md:grid-cols-3 extraLarge:space-x-0 ">
                {tabs.map((tab) => (
                  <Tab as={Fragment} key={tab.title}>
                    {({ selected }) => (
                      <div
                        className={`focus:outline-none cursor-pointer p-2 hover:bg-lms-custom-50  ${
                          selected
                            ? 'text-[#8B173B] border-b-2 border-[#8B173B] transition-all duration-300'
                            : 'hover:border-b-2 hover:border-lms-custom-100'
                        }`}
                      >
                        <p>{tab.title}</p>
                      </div>
                    )}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels>
                {tabs.map((tab) => (
                  <Tab.Panel key={tab.title}>{tab.component}</Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </MainContent>
  );
}

export default GroupDetail;
