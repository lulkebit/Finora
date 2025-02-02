import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { authApi } from '../services/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiError {
    error: string;
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authApi.login(email, password);
            toast.success('Login erfolgreich');
            navigate('/');
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            toast.error(
                err.response?.data?.error || 'Ein Fehler ist aufgetreten'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
            },
        },
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900'>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='backdrop-blur-md bg-black/30 border-b border-gray-800'
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className='flex items-center space-x-3'
                        >
                            <img
                                src='/logo.svg'
                                alt='Finora'
                                className='h-8 w-8'
                            />
                            <h1 className='text-xl font-semibold text-white'>
                                Finora
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </motion.nav>

            <div className='flex items-center justify-center p-4 mt-12'>
                <motion.div
                    initial='hidden'
                    animate='visible'
                    variants={containerVariants}
                    className='w-full max-w-md'
                >
                    <GlassCard className='backdrop-blur-md bg-black/30'>
                        <motion.div
                            variants={containerVariants}
                            className='space-y-8'
                        >
                            <div className='text-center'>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        duration: 0.5,
                                    }}
                                    className='w-24 h-24 mx-auto mb-6'
                                >
                                    <img
                                        src='/logo.svg'
                                        alt='Finora Logo'
                                        className='w-full h-full'
                                    />
                                </motion.div>
                                <motion.h1
                                    variants={itemVariants}
                                    className='text-3xl font-bold text-white mb-2'
                                >
                                    Willkommen zurück
                                </motion.h1>
                                <motion.p
                                    variants={itemVariants}
                                    className='text-gray-400'
                                >
                                    Melden Sie sich bei Ihrem Konto an
                                </motion.p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <motion.div
                                    variants={itemVariants}
                                    className='space-y-2'
                                >
                                    <label className='block text-sm font-medium text-gray-200'>
                                        E-Mail
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <FiMail className='h-5 w-5 text-gray-500' />
                                        </div>
                                        <motion.input
                                            whileFocus={{ scale: 1.01 }}
                                            type='email'
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                            className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                            placeholder='ihre@email.de'
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className='space-y-2'
                                >
                                    <div className='flex justify-between'>
                                        <label className='block text-sm font-medium text-gray-200'>
                                            Passwort
                                        </label>
                                        <motion.a
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            href='#'
                                            className='text-blue-400 hover:text-blue-300 transition-colors'
                                        >
                                            Passwort vergessen?
                                        </motion.a>
                                    </div>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <FiLock className='h-5 w-5 text-gray-500' />
                                        </div>
                                        <motion.input
                                            whileFocus={{ scale: 1.01 }}
                                            type='password'
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                            placeholder='••••••••'
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className='pt-2'
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type='submit'
                                        disabled={isLoading}
                                        className='w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? (
                                            <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                        ) : (
                                            <>
                                                Anmelden
                                                <FiArrowRight className='ml-2' />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </form>

                            <motion.div
                                variants={itemVariants}
                                className='text-center text-gray-300 pt-4'
                            >
                                <span>Noch kein Konto? </span>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/register')}
                                    className='text-blue-400 hover:text-blue-300 font-medium transition-colors'
                                >
                                    Jetzt registrieren
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
