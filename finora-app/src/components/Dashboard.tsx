import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
    FiLogOut,
    FiDollarSign,
    FiGrid,
    FiTrendingUp,
    FiTrendingDown,
    FiCreditCard,
    FiFileText,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi, dashboardApi } from '../services/api';
import { AccountGroups } from './banking/AccountGroups';
import { GlassCard } from './common/GlassCard';
import { TabNavigation } from './common/TabNavigation';
import { BankingPage } from './banking/BankingPage';
import { PlaidLink } from '../components/PlaidLink';
import { AxiosError } from 'axios';

type BankAccount = {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
    balances: {
        available: number;
        current: number;
        iso_currency_code: string;
    };
};

type DashboardData = {
    accounts: BankAccount[];
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
};

type User = {
    firstName: string;
    lastName: string;
    email: string;
};

const MemoizedGlassCard = memo(GlassCard);
const MemoizedAccountGroups = memo(AccountGroups);

const StatCard = memo(
    ({
        title,
        value,
        icon,
    }: {
        title: string;
        value: string;
        icon: React.ReactNode;
    }) => (
        <MemoizedGlassCard>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm text-gray-400'>{title}</p>
                    <p className='text-2xl font-bold text-white mt-1'>
                        {value}
                    </p>
                </div>
                <div className='p-3 bg-blue-500/20 rounded-lg'>{icon}</div>
            </div>
        </MemoizedGlassCard>
    )
);

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );
    const [needsPlaidSetup, setNeedsPlaidSetup] = useState(false);

    const tabs = useMemo(
        () => [
            {
                id: 'overview',
                label: 'Übersicht',
                icon: <FiGrid className='w-4 h-4' />,
            },
            {
                id: 'accounts',
                label: 'Bankkonten',
                icon: <FiCreditCard className='w-4 h-4' />,
            },
            {
                id: 'contracts',
                label: 'Verträge',
                icon: <FiFileText className='w-4 h-4' />,
            },
        ],
        []
    );

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const accounts: BankAccount[] = await dashboardApi.getAccounts();

            const totalBalance = accounts.reduce(
                (sum: number, account: BankAccount) =>
                    sum + (account.balances.current || 0),
                0
            );

            const monthlyIncome = 5000;
            const monthlyExpenses = 3500;

            setDashboardData({
                accounts,
                totalBalance,
                monthlyIncome,
                monthlyExpenses,
            });
            setNeedsPlaidSetup(false);
        } catch (err) {
            if ((err as AxiosError)?.response?.status === 400) {
                setNeedsPlaidSetup(true);
            } else {
                setError('Fehler beim Laden der Daten');
                console.error('Dashboard Fehler:', err);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleLogout = useCallback(() => {
        authApi.logout();
    }, []);

    const formatCurrency = useCallback((value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    }, []);

    const renderOverview = useCallback(() => {
        if (needsPlaidSetup) {
            return (
                <MemoizedGlassCard>
                    <div className='space-y-6 text-center py-8'>
                        <h2 className='text-xl font-semibold text-white'>
                            Willkommen bei Finora!
                        </h2>
                        <p className='text-gray-300'>
                            Um Ihre Finanzen zu verwalten, verbinden Sie bitte
                            zuerst Ihr Bankkonto.
                        </p>
                        <PlaidLink onSuccess={fetchDashboardData} />
                    </div>
                </MemoizedGlassCard>
            );
        }

        if (!dashboardData) return null;
        return (
            <div className='space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <StatCard
                        title='Gesamtvermögen'
                        value={formatCurrency(dashboardData.totalBalance)}
                        icon={
                            <FiDollarSign className='w-6 h-6 text-blue-400' />
                        }
                    />
                    <StatCard
                        title='Monatliche Einnahmen'
                        value={formatCurrency(dashboardData.monthlyIncome)}
                        icon={
                            <FiTrendingUp className='w-6 h-6 text-green-400' />
                        }
                    />
                    <StatCard
                        title='Monatliche Ausgaben'
                        value={formatCurrency(dashboardData.monthlyExpenses)}
                        icon={
                            <FiTrendingDown className='w-6 h-6 text-red-400' />
                        }
                    />
                </div>

                <MemoizedGlassCard>
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-xl font-semibold text-white'>
                                Kontenübersicht
                            </h2>
                            <div className='flex items-center space-x-2 text-gray-400'>
                                <FiGrid className='w-5 h-5' />
                                <span>
                                    {dashboardData.accounts.length} Konten
                                </span>
                            </div>
                        </div>
                        <MemoizedAccountGroups
                            accounts={dashboardData.accounts}
                            onAccountsUpdate={fetchDashboardData}
                        />
                    </div>
                </MemoizedGlassCard>
            </div>
        );
    }, [dashboardData, formatCurrency, needsPlaidSetup]);

    const renderContracts = () => {
        return (
            <MemoizedGlassCard>
                <div className='space-y-6'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold text-white'>
                            Verträge
                        </h2>
                        <div className='flex items-center space-x-2 text-gray-400'>
                            <FiFileText className='w-5 h-5' />
                            <span>0 Verträge</span>
                        </div>
                    </div>
                    <p className='text-gray-400'>Keine Verträge vorhanden</p>
                </div>
            </MemoizedGlassCard>
        );
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center'>
                <div className='text-white'>Lade Daten...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center'>
                <div className='text-red-500'>{error}</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900'>
            {/* Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='backdrop-blur-md bg-black/30 border-b border-gray-800 sticky top-0 z-50'
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className='flex-shrink-0'
                        >
                            <div className='flex items-center space-x-3'>
                                <img
                                    src='/logo.svg'
                                    alt='Finora'
                                    className='h-8 w-8'
                                />
                                <h1 className='text-xl font-semibold text-white'>
                                    Finora
                                </h1>
                            </div>
                        </motion.div>
                        <div className='flex items-center space-x-4'>
                            {user && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='text-gray-300'
                                >
                                    {user.firstName} {user.lastName}
                                </motion.span>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className='flex items-center text-gray-300 hover:text-white transition-colors'
                            >
                                <FiLogOut className='mr-2' />
                                <span>Abmelden</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hauptinhalt */}
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
            >
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'accounts' && (
                            <BankingPage
                                accounts={dashboardData?.accounts || []}
                                onAccountsUpdate={fetchDashboardData}
                            />
                        )}
                        {activeTab === 'contracts' && renderContracts()}
                    </motion.div>
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
