import { useState, useCallback, memo, useMemo } from 'react';
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

const MemoizedGlassCard = memo(GlassCard);

const LoadingSpinner = memo(() => (
    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
));

const InputField = memo(
    ({
        label,
        name,
        type,
        value,
        onChange,
        icon: Icon,
        placeholder,
        required = true,
    }: {
        label: string;
        name: string;
        type: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        icon: React.ComponentType<any>;
        placeholder: string;
        required?: boolean;
    }) => (
        <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-200'>
                {label}
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                    <Icon className='h-5 w-5 text-gray-500' />
                </div>
                <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
);

const SelectField = memo(
    ({
        label,
        name,
        value,
        onChange,
        options,
        icon: Icon,
    }: {
        label: string;
        name: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        options: string[];
        icon: React.ComponentType<any>;
    }) => (
        <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-200'>
                {label}
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'>
                    <Icon className='h-5 w-5 text-gray-500' />
                </div>
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    required
                    className='w-full pl-10 px-4 py-2 bg-black/30 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white appearance-none'
                >
                    <option value=''>Bitte wählen</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
);

const StepIndicator = memo(
    ({
        currentStep,
        steps,
    }: {
        currentStep: RegisterStep;
        steps: Record<RegisterStep, StepConfig>;
    }) => (
        <div className='flex items-center justify-between mb-8'>
            {Object.entries(steps).map(([step, config], index) => (
                <div
                    key={step}
                    className={`flex items-center ${
                        index < Object.keys(steps).length - 1 ? 'flex-1' : ''
                    }`}
                >
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            step === currentStep
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-400'
                        }`}
                    >
                        {config.icon}
                    </div>
                    {index < Object.keys(steps).length - 1 && (
                        <div
                            className={`flex-1 h-0.5 mx-2 ${
                                Object.keys(steps).indexOf(currentStep) > index
                                    ? 'bg-blue-500'
                                    : 'bg-gray-700'
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    )
);

const StepContent = memo(
    ({
        step,
        config,
        formData,
        onChange,
    }: {
        step: RegisterStep;
        config: StepConfig;
        formData: RegisterFormData;
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => void;
    }) => {
        const content = useMemo(() => {
            switch (step) {
                case 'account':
                    return (
                        <>
                            <InputField
                                label='E-Mail'
                                name='email'
                                type='email'
                                value={formData.email}
                                onChange={onChange}
                                icon={FiMail}
                                placeholder='ihre@email.de'
                            />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <InputField
                                    label='Passwort'
                                    name='password'
                                    type='password'
                                    value={formData.password}
                                    onChange={onChange}
                                    icon={FiLock}
                                    placeholder='••••••••'
                                />
                                <InputField
                                    label='Passwort bestätigen'
                                    name='confirmPassword'
                                    type='password'
                                    value={formData.confirmPassword}
                                    onChange={onChange}
                                    icon={FiLock}
                                    placeholder='••••••••'
                                />
                            </div>
                        </>
                    );
                case 'personal':
                    return (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <InputField
                                    label='Vorname'
                                    name='firstName'
                                    type='text'
                                    value={formData.firstName}
                                    onChange={onChange}
                                    icon={FiUser}
                                    placeholder='Max'
                                />
                                <InputField
                                    label='Nachname'
                                    name='lastName'
                                    type='text'
                                    value={formData.lastName}
                                    onChange={onChange}
                                    icon={FiUser}
                                    placeholder='Mustermann'
                                />
                            </div>
                            <InputField
                                label='Geburtsdatum'
                                name='dateOfBirth'
                                type='date'
                                value={formData.dateOfBirth}
                                onChange={onChange}
                                icon={FiCalendar}
                                placeholder=''
                            />
                        </>
                    );
                case 'financial':
                    return (
                        <>
                            <SelectField
                                label='Beschäftigungsstatus'
                                name='employmentStatus'
                                value={formData.employmentStatus}
                                onChange={onChange}
                                options={EMPLOYMENT_STATUS_OPTIONS}
                                icon={FiBriefcase}
                            />
                            <InputField
                                label='Monatliches Einkommen (€)'
                                name='monthlyIncome'
                                type='number'
                                value={formData.monthlyIncome}
                                onChange={onChange}
                                icon={FiDollarSign}
                                placeholder='0'
                            />
                        </>
                    );
                case 'goals':
                    return (
                        <>
                            <InputField
                                label='Monatliches Sparziel (€)'
                                name='savingsGoal'
                                type='number'
                                value={formData.savingsGoal}
                                onChange={onChange}
                                icon={FiTarget}
                                placeholder='0'
                            />
                            <SelectField
                                label='Risikobereitschaft'
                                name='riskTolerance'
                                value={formData.riskTolerance}
                                onChange={onChange}
                                options={RISK_TOLERANCE_OPTIONS}
                                icon={FiShield}
                            />
                        </>
                    );
            }
        }, [step, formData, onChange]);

        return (
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className='space-y-4'
            >
                {content}
            </motion.div>
        );
    }
);

const NavigationButtons = memo(
    ({
        currentStep,
        isLoading,
        onBack,
        onNext,
        onSubmit,
    }: {
        currentStep: RegisterStep;
        isLoading: boolean;
        onBack: () => void;
        onNext: () => void;
        onSubmit: (e: React.FormEvent) => void;
    }) => (
        <div className='flex justify-between mt-8'>
            {currentStep !== 'account' && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    className='flex items-center px-6 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors'
                >
                    <FiArrowLeft className='mr-2' />
                    Zurück
                </motion.button>
            )}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={currentStep === 'goals' ? onSubmit : onNext}
                disabled={isLoading}
                className='flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {currentStep === 'goals' ? 'Registrieren' : 'Weiter'}
                        <FiArrowRight className='ml-2' />
                    </>
                )}
            </motion.button>
        </div>
    )
);

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

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        []
    );

    const validateStep = useCallback(() => {
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
    }, [formData, currentStep]);

    const handleNext = useCallback(() => {
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
    }, [currentStep, validateStep]);

    const handleBack = useCallback(() => {
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
    }, [currentStep]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
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
        },
        [formData, validateStep, navigate]
    );

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
                <MemoizedGlassCard>
                    <StepIndicator currentStep={currentStep} steps={STEPS} />

                    <div className='text-center mb-8'>
                        <h2 className='text-2xl font-bold text-white'>
                            {STEPS[currentStep].title}
                        </h2>
                        <p className='text-gray-400 mt-1'>
                            {STEPS[currentStep].description}
                        </p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <AnimatePresence mode='wait'>
                            <StepContent
                                step={currentStep}
                                config={STEPS[currentStep]}
                                formData={formData}
                                onChange={handleChange}
                            />
                        </AnimatePresence>

                        <NavigationButtons
                            currentStep={currentStep}
                            isLoading={isLoading}
                            onBack={handleBack}
                            onNext={handleNext}
                            onSubmit={handleSubmit}
                        />
                    </form>
                </MemoizedGlassCard>
            </div>
        </div>
    );
}
