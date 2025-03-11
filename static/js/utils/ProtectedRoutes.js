/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { useSelector } from 'react-redux';

import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/available-courses" />;
}

export default ProtectedRoutes;
