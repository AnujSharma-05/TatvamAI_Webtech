import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
// import Home from '../pages/Home';
// import Login from '../pages/Login';
// import Register from '../pages/Register';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <MainLayout>
        <ProtectedRoute>
          <div><h1>Home</h1></div>
        </ProtectedRoute>
      </MainLayout>
    ),
  },
  {
    path: '/auth',
    element: <MainLayout><></></MainLayout>,
    children: [
      { path: 'login', element: <div><h1>Login</h1></div> },
      { path: 'register', element: <div><h1>Register</h1></div> },
      { path: '', element: <Navigate to="/auth/login" replace /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);