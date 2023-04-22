import ReactDOM from 'react-dom/client'
import './style.scss'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import ErrorPage from './pages/Error';
import { RegistrationPage } from './pages/Register';
import { OtpVerificationPage } from './pages/OtpVerification';
import { UserContextProvider } from './hooks/useAuth';
import { HomePage } from './pages/dashboard/Home';
import { Public } from './middlewares/Public';
import { Dashboard } from './pages/dashboard/Dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';
import { CreateRequestPage } from './pages/dashboard/CreateRequest';

export const queryClient = new QueryClient()


const router = createBrowserRouter([
  {
    path: "/",
    element: <Public />,

    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegistrationPage />
      },
      {
        path: "/otp/:uuid",
        element: <OtpVerificationPage />
      },

    ]
  },
  {
    path: "dashboard",
    errorElement: <ErrorPage />,
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <HomePage />
      },
      {
        path: "request",
        element: <CreateRequestPage />
      },
    ]
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
