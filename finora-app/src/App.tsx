import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,
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
    return <RouterProvider router={router} />;
}
