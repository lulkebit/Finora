import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ErrorBoundary>
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            </ErrorBoundary>
        ),
        errorElement: (
            <ErrorBoundary>
                <div />
            </ErrorBoundary>
        ),
    },
    {
        path: '/login',
        element: (
            <ErrorBoundary>
                <Login />
            </ErrorBoundary>
        ),
        errorElement: (
            <ErrorBoundary>
                <div />
            </ErrorBoundary>
        ),
    },
    {
        path: '/register',
        element: (
            <ErrorBoundary>
                <Register />
            </ErrorBoundary>
        ),
        errorElement: (
            <ErrorBoundary>
                <div />
            </ErrorBoundary>
        ),
    },
]);

export default function App() {
    return (
        <ErrorBoundary>
            <Toaster
                position='bottom-right'
                theme='dark'
                closeButton
                richColors
            />
            <RouterProvider router={router} />
        </ErrorBoundary>
    );
}
