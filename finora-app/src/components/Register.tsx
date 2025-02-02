import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './common/GlassCard';
import { useNavigate } from 'react-router-dom';
import {
    FiMail,
    FiLock,
    FiUser,
    FiCalendar,
    FiBriefcase,
    FiDollarSign,
    FiTarget,
    FiArrowRight,
    FiArrowLeft,
    FiShield,
} from 'react-icons/fi';
import { authApi } from '../services/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface ApiError {
    error: string;
}

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    employmentStatus: string;
    monthlyIncome: string;
    savingsGoal: string;
    riskTolerance: string;
}

type RegisterStep = 'account' | 'personal' | 'financial' | 'goals';

interface StepConfig {
    title: string;
    description: string;
    icon: JSX.Element;
}

const STEPS: Record<RegisterStep, StepConfig> = {
    account: {
        title: 'Account erstellen',
        description: 'Erstellen Sie Ihre Zugangsdaten',
        icon: <FiShield className='w-6 h-6 text-blue-400' />,
    },
    personal: {
        title: 'Persönliche Daten',
        description: 'Erzählen Sie uns etwas über sich',
        icon: <FiUser className='w-6 h-6 text-green-400' />,
    },
    financial: {
        title: 'Finanzielle Situation',
        description: 'Ihre aktuelle finanzielle Lage',
        icon: <FiDollarSign className='w-6 h-6 text-purple-400' />,
    },
    goals: {
        title: 'Finanzziele',
        description: 'Ihre finanziellen Ziele',
        icon: <FiTarget className='w-6 h-6 text-orange-400' />,
    },
};

const EMPLOYMENT_STATUS_OPTIONS = [
    'Angestellt',
    'Selbstständig',
    'Student',
    'Rentner',
    'Arbeitssuchend',
    'Sonstiges',
];

const RISK_TOLERANCE_OPTIONS = [
    'Konservativ',
    'Ausgewogen',
    'Wachstumsorientiert',
    'Spekulativ',
];

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<RegisterStep>('account');
    const [formData, setFormData] = useState<RegisterFormData>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        employmentStatus: '',
        monthlyIncome: '',
        savingsGoal: '',
        riskTolerance: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateStep = () => {
        switch (currentStep) {
            case 'account':
                if (
                    !formData.email ||
                    !formData.password ||
                    !formData.confirmPassword
                ) {
                    toast.error('Bitte füllen Sie alle Felder aus');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Die Passwörter stimmen nicht überein');
                    return false;
                }
                if (formData.password.length < 8) {
                    toast.error(
                        'Das Passwort muss mindestens 8 Zeichen lang sein'
                    );
                    return false;
                }
                return true;

            case 'personal':
                if (
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.dateOfBirth
                ) {
                    toast.error('Bitte füllen Sie alle Felder aus');
                    return false;
                }
                return true;

            case 'financial':
                if (!formData.employmentStatus || !formData.monthlyIncome) {
                    toast.error('Bitte füllen Sie alle Felder aus');
                    return false;
                }
                return true;

            case 'goals':
                if (!formData.savingsGoal || !formData.riskTolerance) {
                    toast.error('Bitte füllen Sie alle Felder aus');
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep()) return;

        const steps: RegisterStep[] = [
            'account',
            'personal',
            'financial',
            'goals',
        ];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const steps: RegisterStep[] = [
            'account',
            'personal',
            'financial',
            'goals',
        ];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;

        setIsLoading(true);
        try {
            const { confirmPassword: _, ...registrationData } = formData;
            await authApi.register({
                ...registrationData,
                monthlyIncome: parseFloat(registrationData.monthlyIncome),
                savingsGoal: parseFloat(registrationData.savingsGoal),
            });
            toast.success('Registrierung erfolgreich');
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 'account':
                return (
                    <motion.div
                        key='account'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='space-y-4'
                    >
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                E-Mail
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                    <FiMail className='h-5 w-5 text-gray-500' />
                                </div>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                    placeholder='ihre@email.de'
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-200'>
                                    Passwort
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                        <FiLock className='h-5 w-5 text-gray-500' />
                                    </div>
                                    <input
                                        type='password'
                                        name='password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                        className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                        placeholder='••••••••'
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-200'>
                                    Passwort bestätigen
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                        <FiLock className='h-5 w-5 text-gray-500' />
                                    </div>
                                    <input
                                        type='password'
                                        name='confirmPassword'
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                        placeholder='••••••••'
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 'personal':
                return (
                    <motion.div
                        key='personal'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='space-y-4'
                    >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-200'>
                                    Vorname
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                        <FiUser className='h-5 w-5 text-gray-500' />
                                    </div>
                                    <input
                                        type='text'
                                        name='firstName'
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-200'>
                                    Nachname
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                        <FiUser className='h-5 w-5 text-gray-500' />
                                    </div>
                                    <input
                                        type='text'
                                        name='lastName'
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Geburtsdatum
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                    <FiCalendar className='h-5 w-5 text-gray-500' />
                                </div>
                                <input
                                    type='date'
                                    name='dateOfBirth'
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                />
                            </div>
                        </div>
                    </motion.div>
                );

            case 'financial':
                return (
                    <motion.div
                        key='financial'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='space-y-4'
                    >
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Beschäftigungsstatus
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                    <FiBriefcase className='h-5 w-5 text-gray-500' />
                                </div>
                                <select
                                    name='employmentStatus'
                                    value={formData.employmentStatus}
                                    onChange={handleChange}
                                    required
                                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                >
                                    <option value=''>Bitte wählen</option>
                                    {EMPLOYMENT_STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Monatliches Einkommen
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                    <FiDollarSign className='h-5 w-5 text-gray-500' />
                                </div>
                                <input
                                    type='number'
                                    name='monthlyIncome'
                                    value={formData.monthlyIncome}
                                    onChange={handleChange}
                                    required
                                    min='0'
                                    step='0.01'
                                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                />
                            </div>
                        </div>
                    </motion.div>
                );

            case 'goals':
                return (
                    <motion.div
                        key='goals'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className='space-y-4'
                    >
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Monatliches Sparziel
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                    <FiTarget className='h-5 w-5 text-gray-500' />
                                </div>
                                <input
                                    type='number'
                                    name='savingsGoal'
                                    value={formData.savingsGoal}
                                    onChange={handleChange}
                                    required
                                    min='0'
                                    step='0.01'
                                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Risikobereitschaft
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                                    <FiTarget className='h-5 w-5 text-gray-500' />
                                </div>
                                <select
                                    name='riskTolerance'
                                    value={formData.riskTolerance}
                                    onChange={handleChange}
                                    required
                                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                                >
                                    <option value=''>Bitte wählen</option>
                                    {RISK_TOLERANCE_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    const steps = [
        'account',
        'personal',
        'financial',
        'goals',
    ] as RegisterStep[];
    const currentStepIndex = steps.indexOf(currentStep);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

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

            <div className='max-w-2xl mx-auto px-4 py-8'>
                <motion.div
                    initial='hidden'
                    animate='visible'
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 },
                    }}
                >
                    <GlassCard className='backdrop-blur-md bg-black/30'>
                        {/* Logo */}
                        <div className='flex flex-col items-center mb-8'>
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <img
                                    src='/logo.svg'
                                    alt='Finora'
                                    className='h-16 w-16 mb-4'
                                />
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className='text-center'
                            >
                                <h1 className='text-2xl font-bold text-white mb-2'>
                                    Willkommen bei Finora
                                </h1>
                                <p className='text-gray-400'>
                                    Ihr Weg zu intelligenter Finanzverwaltung
                                </p>
                            </motion.div>
                        </div>

                        {/* Progress Bar */}
                        <div className='mb-8'>
                            <div className='flex justify-between items-center mb-2'>
                                <div className='flex items-center space-x-3'>
                                    {STEPS[currentStep].icon}
                                    <div>
                                        <h2 className='text-lg font-semibold text-white'>
                                            {STEPS[currentStep].title}
                                        </h2>
                                        <p className='text-sm text-gray-400'>
                                            {STEPS[currentStep].description}
                                        </p>
                                    </div>
                                </div>
                                <span className='text-sm text-gray-400'>
                                    Schritt {currentStepIndex + 1} von{' '}
                                    {steps.length}
                                </span>
                            </div>
                            <div className='h-2 bg-gray-800 rounded-full overflow-hidden'>
                                <motion.div
                                    className='h-full bg-blue-500'
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>

                        <form
                            onSubmit={
                                currentStep === 'goals'
                                    ? handleSubmit
                                    : (e) => {
                                          e.preventDefault();
                                          handleNext();
                                      }
                            }
                        >
                            <AnimatePresence mode='wait'>
                                {renderStepContent()}
                            </AnimatePresence>

                            <div className='flex justify-between mt-8'>
                                {currentStepIndex > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type='button'
                                        onClick={handleBack}
                                        className='flex items-center px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors'
                                    >
                                        <FiArrowLeft className='mr-2' />
                                        Zurück
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type={
                                        currentStep === 'goals'
                                            ? 'submit'
                                            : 'button'
                                    }
                                    onClick={
                                        currentStep === 'goals'
                                            ? undefined
                                            : handleNext
                                    }
                                    disabled={isLoading}
                                    className='flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto'
                                >
                                    {isLoading ? (
                                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    ) : (
                                        <>
                                            {currentStep === 'goals'
                                                ? 'Registrierung abschließen'
                                                : 'Weiter'}
                                            <FiArrowRight className='ml-2' />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            className='text-center text-gray-300 mt-6'
                        >
                            <span>Bereits ein Konto? </span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className='text-blue-400 hover:text-blue-300 font-medium transition-colors'
                            >
                                Jetzt anmelden
                            </motion.button>
                        </motion.div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
