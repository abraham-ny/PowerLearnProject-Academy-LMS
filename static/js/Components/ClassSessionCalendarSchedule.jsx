import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  AppointmentTooltip,
  TodayButton,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';
import { Grid } from '@mui/material';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import DescriptionIcon from '@mui/icons-material/Description';

function Appointment({ children, style, ...restProps }) {
  return (
    <Appointments.Appointment
      {...restProps}
      style={{
        ...style,
        backgroundColor: '#8B173B',
        borderRadius: '8px',
      }}
    >
      {children}
    </Appointments.Appointment>
  );
}

const currentDate = new Date();

const hours = { start: 7.5, end: 21.5 };

function Content({ children, appointmentData, ...restProps }) {
  return (
    <AppointmentTooltip.Content
      {...restProps}
      appointmentData={appointmentData}
    >
      <Grid container alignItems="center">
        <Grid item xs={2} className="text-center">
          <VideoCameraFrontIcon className="text-persian-500" />
        </Grid>
        <Grid item xs={10}>
          <a
            href={`/class-sessions/${appointmentData.id}`}
            // target="_blank"
            className="text-persian-500 cursor-pointer text-base"
          >
            Click here to register/join the session
          </a>
        </Grid>
        <Grid container alignItems="flex-start" className="mt-4">
          <Grid item xs={2} className="text-center">
            <DescriptionIcon className="text-gray-400" />
          </Grid>
          <Grid item xs={10}>
            <p className="text-base">{appointmentData.description}</p>
          </Grid>
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  );
}

export default function ClassSessionCalendarSchedule({ classSessions }) {
  return (
    <Paper className="my-4" height={500}>
      <Scheduler data={classSessions}>
        <ViewState defaultCurrentDate={currentDate} />
        <MonthView />
        <WeekView startDayHour={hours.start} endDayHour={hours.end} />
        <DayView startDayHour={hours.start} endDayHour={hours.end} />
        <Toolbar />
        <TodayButton />
        <DateNavigator />
        <ViewSwitcher />
        <Appointments appointmentComponent={Appointment} />
        <AppointmentTooltip contentComponent={Content} showCloseButton />
      </Scheduler>
    </Paper>
  );
}
