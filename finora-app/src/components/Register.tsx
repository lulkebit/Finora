import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './common/GlassCard';
import { useNavigate } from 'react-router-dom';
import {
    FiUser,
    FiMail,
    FiLock,
    FiCreditCard,
    FiDollarSign,
    FiArrowRight,
    FiArrowLeft,
    FiTarget,
    FiShield,
    FiTrendingUp,
} from 'react-icons/fi';

type RegisterStep =
    | 'welcome'
    | 'personal'
    | 'security'
    | 'account'
    | 'employment'
    | 'financial'
    | 'goals'
    | 'verification';

interface StepInfo {
    title: string;
    icon: React.ReactNode;
    description: string;
}

const STEPS: Record<RegisterStep, StepInfo> = {
    welcome: {
        title: 'Willkommen',
        icon: <FiUser className='w-6 h-6' />,
        description: 'Beginnen Sie Ihre finanzielle Reise mit Finora',
    },
    personal: {
        title: 'Persönliche Daten',
        icon: <FiUser className='w-6 h-6' />,
        description: 'Erzählen Sie uns etwas über sich',
    },
    security: {
        title: 'Sicherheit',
        icon: <FiLock className='w-6 h-6' />,
        description: 'Schützen Sie Ihren Account',
    },
    account: {
        title: 'Bankverbindung',
        icon: <FiCreditCard className='w-6 h-6' />,
        description: 'Verbinden Sie Ihr Bankkonto',
    },
    employment: {
        title: 'Beschäftigung',
        icon: <FiDollarSign className='w-6 h-6' />,
        description: 'Ihre berufliche Situation',
    },
    financial: {
        title: 'Finanzen',
        icon: <FiTrendingUp className='w-6 h-6' />,
        description: 'Ihre finanzielle Situation',
    },
    goals: {
        title: 'Ziele',
        icon: <FiTarget className='w-6 h-6' />,
        description: 'Ihre finanziellen Ziele',
    },
    verification: {
        title: 'Bestätigung',
        icon: <FiShield className='w-6 h-6' />,
        description: 'Letzte Schritte zur Aktivierung',
    },
};

interface FormData {
    // Persönliche Daten
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;

    // Kontodaten
    iban: string;
    bankName: string;
    accountHolder: string;

    // Finanzielle Informationen
    monthlyIncome: string;
    employmentStatus: string;
    savingsGoal: string;
    riskTolerance: string;

    // Verifikation
    acceptTerms: boolean;
    acceptPrivacy: boolean;
    acceptDataProcessing: boolean;
}

export default function Register() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<RegisterStep>('welcome');
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        iban: '',
        bankName: '',
        accountHolder: '',
        monthlyIncome: '',
        employmentStatus: '',
        savingsGoal: '',
        riskTolerance: '',
        acceptTerms: false,
        acceptPrivacy: false,
        acceptDataProcessing: false,
    });

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

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleNext = () => {
        const steps: RegisterStep[] = [
            'welcome',
            'personal',
            'security',
            'account',
            'employment',
            'financial',
            'goals',
            'verification',
        ];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const steps: RegisterStep[] = [
            'welcome',
            'personal',
            'security',
            'account',
            'employment',
            'financial',
            'goals',
            'verification',
        ];
        const currentIndex = steps.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implementiere Registrierungslogik hier
        console.log('Registration data:', formData);
    };

    const steps: RegisterStep[] = [
        'welcome',
        'personal',
        'security',
        'account',
        'employment',
        'financial',
        'goals',
        'verification',
    ];

    const currentStepIndex = steps.indexOf(currentStep);
    const progress = (currentStepIndex / (steps.length - 1)) * 100;

    const renderStepIndicator = () => (
        <div className='mb-8'>
            <div className='flex justify-between mb-2'>
                <span className='text-sm text-gray-400'>
                    Schritt {currentStepIndex + 1} von {steps.length}
                </span>
                <span className='text-sm text-gray-400'>
                    {Math.round(progress)}%
                </span>
            </div>
            <div className='w-full h-2 bg-gray-800 rounded-full overflow-hidden'>
                <motion.div
                    className='h-full bg-blue-500'
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 'welcome':
                return (
                    <motion.div
                        key='welcome'
                        variants={itemVariants}
                        className='space-y-6 text-center'
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className='w-32 h-32 mx-auto mb-8'
                        >
                            <img
                                src='/logo.svg'
                                alt='Finora Logo'
                                className='w-full h-full'
                            />
                        </motion.div>
                        <h1 className='text-3xl font-bold text-white'>
                            Willkommen bei Finora
                        </h1>
                        <p className='text-gray-300 max-w-md mx-auto'>
                            Ihr persönlicher Finanzassistent, der Ihnen hilft,
                            Ihre finanziellen Ziele zu erreichen.
                        </p>
                        <div className='space-y-4 mt-8'>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className='p-4 bg-black/20 rounded-lg'
                            >
                                <h3 className='text-white font-medium'>
                                    Smart Banking
                                </h3>
                                <p className='text-gray-400 text-sm'>
                                    Verwalten Sie Ihre Finanzen intelligent und
                                    effizient
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className='p-4 bg-black/20 rounded-lg'
                            >
                                <h3 className='text-white font-medium'>
                                    Automatische Kategorisierung
                                </h3>
                                <p className='text-gray-400 text-sm'>
                                    Behalten Sie den Überblick über Ihre
                                    Ausgaben
                                </p>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className='p-4 bg-black/20 rounded-lg'
                            >
                                <h3 className='text-white font-medium'>
                                    Finanzielle Ziele
                                </h3>
                                <p className='text-gray-400 text-sm'>
                                    Setzen und erreichen Sie Ihre Sparziele
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                );
            case 'personal':
                return (
                    <motion.div
                        key='personal'
                        variants={itemVariants}
                        className='space-y-4'
                    >
                        <div className='flex items-center space-x-4 mb-6'>
                            <div className='p-3 bg-blue-500/10 rounded-lg'>
                                <FiUser className='w-6 h-6 text-blue-400' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-white'>
                                    {STEPS[currentStep].title}
                                </h2>
                                <p className='text-gray-400'>
                                    {STEPS[currentStep].description}
                                </p>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Vorname
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='firstName'
                                type='text'
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Nachname
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='lastName'
                                type='text'
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                E-Mail
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='email'
                                type='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Passwort
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='password'
                                type='password'
                                value={formData.password}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Passwort bestätigen
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='confirmPassword'
                                type='password'
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Geburtsdatum
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='dateOfBirth'
                                type='date'
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                    </motion.div>
                );
            case 'security':
                return (
                    <motion.div
                        key='security'
                        variants={itemVariants}
                        className='space-y-4'
                    >
                        <div className='flex items-center space-x-4 mb-6'>
                            <div className='p-3 bg-purple-500/10 rounded-lg'>
                                <FiLock className='w-6 h-6 text-purple-400' />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-white'>
                                    {STEPS[currentStep].title}
                                </h2>
                                <p className='text-gray-400'>
                                    {STEPS[currentStep].description}
                                </p>
                            </div>
                        </div>
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-200'>
                                    E-Mail
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    name='email'
                                    type='email'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500'
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-200'>
                                    Passwort
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    name='password'
                                    type='password'
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500'
                                    required
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-200'>
                                    Passwort bestätigen
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    name='confirmPassword'
                                    type='password'
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500'
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 'account':
                return (
                    <motion.div
                        key='account'
                        variants={itemVariants}
                        className='space-y-4'
                    >
                        <h2 className='text-2xl font-bold text-white mb-6'>
                            Bankverbindung
                        </h2>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                IBAN
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='iban'
                                type='text'
                                value={formData.iban}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Bank
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='bankName'
                                type='text'
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Kontoinhaber
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='accountHolder'
                                type='text'
                                value={formData.accountHolder}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                    </motion.div>
                );
            case 'employment':
                return (
                    <motion.div
                        key='employment'
                        variants={itemVariants}
                        className='space-y-4'
                    >
                        <h2 className='text-2xl font-bold text-white mb-6'>
                            Beschäftigung
                        </h2>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Monatliches Einkommen
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='monthlyIncome'
                                type='number'
                                value={formData.monthlyIncome}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Beschäftigungsstatus
                            </label>
                            <motion.select
                                whileFocus={{ scale: 1.01 }}
                                name='employmentStatus'
                                value={formData.employmentStatus}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            >
                                <option value=''>Bitte wählen</option>
                                <option value='employed'>Angestellt</option>
                                <option value='self-employed'>
                                    Selbstständig
                                </option>
                                <option value='student'>Student</option>
                                <option value='retired'>Rentner</option>
                                <option value='other'>Sonstiges</option>
                            </motion.select>
                        </div>
                    </motion.div>
                );
            case 'financial':
                return (
                    <motion.div
                        key='financial'
                        variants={itemVariants}
                        className='space-y-4'
                    >
                        <h2 className='text-2xl font-bold text-white mb-6'>
                            Finanzen
                        </h2>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Monatliches Sparziel
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='savingsGoal'
                                type='number'
                                value={formData.savingsGoal}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Risikobereitschaft
                            </label>
                            <motion.select
                                whileFocus={{ scale: 1.01 }}
                                name='riskTolerance'
                                value={formData.riskTolerance}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            >
                                <option value=''>Bitte wählen</option>
                                <option value='conservative'>
                                    Konservativ
                                </option>
                                <option value='moderate'>Moderat</option>
                                <option value='aggressive'>
                                    Risikofreudig
                                </option>
                            </motion.select>
                        </div>
                    </motion.div>
                );
            case 'goals':
                return (
                    <motion.div
                        key='goals'
                        variants={itemVariants}
                        className='space-y-4'
                    >
                        <h2 className='text-2xl font-bold text-white mb-6'>
                            Ziele
                        </h2>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-200'>
                                Monatliches Sparziel
                            </label>
                            <motion.input
                                whileFocus={{ scale: 1.01 }}
                                name='savingsGoal'
                                type='number'
                                value={formData.savingsGoal}
                                onChange={handleInputChange}
                                className='w-full px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500'
                                required
                            />
                        </div>
                    </motion.div>
                );
            case 'verification':
                return (
                    <motion.div
                        key='verification'
                        variants={itemVariants}
                        className='space-y-4'
                    >
                        <h2 className='text-2xl font-bold text-white mb-6'>
                            Bestätigung
                        </h2>
                        <div className='space-y-4'>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className='flex items-center space-x-3'
                            >
                                <input
                                    type='checkbox'
                                    name='acceptTerms'
                                    checked={formData.acceptTerms}
                                    onChange={handleInputChange}
                                    className='h-4 w-4 rounded border-gray-800 bg-black/30 text-blue-500 focus:ring-blue-500'
                                />
                                <label className='text-sm text-gray-200'>
                                    Ich akzeptiere die Nutzungsbedingungen
                                </label>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className='flex items-center space-x-3'
                            >
                                <input
                                    type='checkbox'
                                    name='acceptPrivacy'
                                    checked={formData.acceptPrivacy}
                                    onChange={handleInputChange}
                                    className='h-4 w-4 rounded border-gray-800 bg-black/30 text-blue-500 focus:ring-blue-500'
                                />
                                <label className='text-sm text-gray-200'>
                                    Ich akzeptiere die Datenschutzerklärung
                                </label>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className='flex items-center space-x-3'
                            >
                                <input
                                    type='checkbox'
                                    name='acceptDataProcessing'
                                    checked={formData.acceptDataProcessing}
                                    onChange={handleInputChange}
                                    className='h-4 w-4 rounded border-gray-800 bg-black/30 text-blue-500 focus:ring-blue-500'
                                />
                                <label className='text-sm text-gray-200'>
                                    Ich stimme der Verarbeitung meiner Daten zu
                                </label>
                            </motion.div>
                        </div>
                    </motion.div>
                );
        }
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
                        {currentStep !== 'welcome' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='text-sm text-gray-400'
                            >
                                {STEPS[currentStep].title}
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.nav>

            <div className='flex items-center justify-center p-4 mt-8'>
                <motion.div
                    initial='hidden'
                    animate='visible'
                    variants={containerVariants}
                    className='w-full max-w-2xl'
                >
                    <GlassCard className='backdrop-blur-md bg-black/30'>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {currentStep !== 'welcome' && renderStepIndicator()}
                            <AnimatePresence mode='wait' custom={currentStep}>
                                {renderStepContent()}
                            </AnimatePresence>

                            <motion.div
                                variants={itemVariants}
                                className='flex justify-between mt-8'
                            >
                                {currentStep !== 'welcome' && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type='button'
                                        onClick={handleBack}
                                        className='flex items-center px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors'
                                    >
                                        <FiArrowLeft className='mr-2' />
                                        Zurück
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type={
                                        currentStep === 'verification'
                                            ? 'submit'
                                            : 'button'
                                    }
                                    onClick={
                                        currentStep === 'verification'
                                            ? undefined
                                            : handleNext
                                    }
                                    className='flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto'
                                >
                                    {currentStep === 'verification' ? (
                                        'Registrieren'
                                    ) : (
                                        <>
                                            {currentStep === 'welcome'
                                                ? 'Starten'
                                                : 'Weiter'}
                                            <FiArrowRight className='ml-2' />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
