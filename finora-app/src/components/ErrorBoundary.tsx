import { Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4'>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className='backdrop-blur-md bg-black/30 border border-gray-800 rounded-xl shadow-2xl p-8 max-w-lg w-full'
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className='flex items-center justify-center mb-6'
                        >
                            <div className='bg-red-900/30 p-4 rounded-full'>
                                <FiAlertTriangle className='w-10 h-10 text-red-400' />
                            </div>
                        </motion.div>
                        <motion.h2
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className='text-2xl font-semibold text-center text-white mb-4'
                        >
                            Oops! Ein Fehler ist aufgetreten
                        </motion.h2>
                        <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className='text-gray-400 text-center mb-8'
                        >
                            {this.state.error?.message ||
                                'Ein unerwarteter Fehler ist aufgetreten.'}
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className='flex justify-center gap-4'
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => (window.location.href = '/')}
                                className='flex items-center space-x-2 bg-gray-800/50 text-gray-300 hover:text-white px-6 py-2.5 rounded-lg transition-colors'
                            >
                                <FiHome className='w-4 h-4' />
                                <span>Zur Startseite</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.reload()}
                                className='flex items-center space-x-2 bg-blue-900/50 text-blue-400 hover:text-blue-300 px-6 py-2.5 rounded-lg transition-colors'
                            >
                                <FiRefreshCw className='w-4 h-4' />
                                <span>Seite neu laden</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
