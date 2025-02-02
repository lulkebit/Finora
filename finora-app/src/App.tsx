import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { PrivateRoute } from './components/PrivateRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        ),
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
]);

export default function App() {
    return (
        <>
            <Toaster
                position='bottom-right'
                theme='dark'
                closeButton
                richColors
            />
            <RouterProvider router={router} />
        </>
    );
}
