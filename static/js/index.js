/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */
import 'swiper/css';
import 'swiper/css/navigation';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
// import { Fab } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { store } from './app/store';
import 'quill/dist/quill.snow.css'; // Add css for snow theme
import 'react-phone-number-input/style.css';

TimeAgo.addDefaultLocale(en);

const container = document.getElementById('root');
const root = createRoot(container);
const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B173B',
    },
    secondary: {
      main: '#00999E',
    },
  },
});

const toastOptions = {
  duration: 10000,
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster toastOptions={toastOptions} />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
