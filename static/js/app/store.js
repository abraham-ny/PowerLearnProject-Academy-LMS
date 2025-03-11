/* eslint-disable import/prefer-default-export */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notificationsReducer from '../features/notification/NotificationSlice';
import textToSpeechReducer from '../features/translate/translateSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
    textToSpeech: textToSpeechReducer,
  },
});
