import { Component, ReactNode, memo } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

const ErrorIcon = memo(() => (
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
));

const ErrorTitle = memo(() => (
    <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className='text-2xl font-semibold text-center text-white mb-4'
    >
        Oops! Ein Fehler ist aufgetreten
    </motion.h2>
));

const ErrorMessage = memo(({ message }: { message?: string }) => (
    <motion.p
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className='text-gray-400 text-center mb-8'
    >
        {message || 'Ein unerwarteter Fehler ist aufgetreten.'}
    </motion.p>
));

const ActionButton = memo(
    ({
        icon: Icon,
        text,
        onClick,
        className,
    }: {
        icon: typeof FiHome | typeof FiRefreshCw;
        text: string;
        onClick: () => void;
        className: string;
    }) => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={className}
        >
            <Icon className='w-4 h-4' />
            <span>{text}</span>
        </motion.button>
    )
);

const ErrorContent = memo(({ error }: { error?: Error }) => (
    <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='backdrop-blur-md bg-black/30 border border-gray-800 rounded-xl shadow-2xl p-8 max-w-lg w-full'
    >
        <ErrorIcon />
        <ErrorTitle />
        <ErrorMessage message={error?.message} />
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className='flex justify-center gap-4'
        >
            <ActionButton
                icon={FiHome}
                text='Zur Startseite'
                onClick={() => (window.location.href = '/')}
                className='flex items-center space-x-2 bg-gray-800/50 text-gray-300 hover:text-white px-6 py-2.5 rounded-lg transition-colors'
            />
            <ActionButton
                icon={FiRefreshCw}
                text='Seite neu laden'
                onClick={() => window.location.reload()}
                className='flex items-center space-x-2 bg-blue-900/50 text-blue-400 hover:text-blue-300 px-6 py-2.5 rounded-lg transition-colors'
            />
        </motion.div>
    </motion.div>
));

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return (
            this.state.hasError !== nextState.hasError ||
            this.state.error !== nextState.error ||
            this.props.children !== nextProps.children
        );
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4'>
                    <ErrorContent error={this.state.error} />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
