import { useState } from 'react';
import { GlassCard } from './common/GlassCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implementiere Login-Logik hier
        console.log('Login attempt:', { email, password });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
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
                            className='flex-shrink-0'
                        >
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
                            className='space-y-6'
                        >
                            <motion.div
                                variants={itemVariants}
                                className='text-center'
                            >
                                <h1 className='text-3xl font-bold text-white mb-2'>
                                    Willkommen zurück
                                </h1>
                                <p className='text-gray-300'>
                                    Melden Sie sich bei Ihrem Konto an
                                </p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                <motion.div
                                    variants={itemVariants}
                                    className='space-y-2'
                                >
                                    <label
                                        htmlFor='email'
                                        className='block text-sm font-medium text-gray-200'
                                    >
                                        E-Mail
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        id='email'
                                        type='email'
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                        placeholder='ihre@email.de'
                                    />
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className='space-y-2'
                                >
                                    <label
                                        htmlFor='password'
                                        className='block text-sm font-medium text-gray-200'
                                    >
                                        Passwort
                                    </label>
                                    <motion.input
                                        whileFocus={{ scale: 1.01 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                        id='password'
                                        type='password'
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                        placeholder='••••••••'
                                    />
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className='flex items-center justify-between text-sm'
                                >
                                    <div className='flex items-center'>
                                        <motion.input
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            id='remember'
                                            type='checkbox'
                                            className='h-4 w-4 rounded border-gray-800 bg-black/30 text-blue-500 focus:ring-blue-500'
                                        />
                                        <label
                                            htmlFor='remember'
                                            className='ml-2 text-gray-300'
                                        >
                                            Angemeldet bleiben
                                        </label>
                                    </div>
                                    <motion.a
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href='#'
                                        className='text-blue-400 hover:text-blue-300 transition-colors'
                                    >
                                        Passwort vergessen?
                                    </motion.a>
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type='submit'
                                    className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200'
                                >
                                    Anmelden
                                </motion.button>
                            </form>

                            <motion.div
                                variants={itemVariants}
                                className='text-center text-gray-300'
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
