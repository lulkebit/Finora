import { useState, useEffect } from 'react';
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

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );

    const tabs = [
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
    ];

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const accounts: BankAccount[] = await dashboardApi.getAccounts();

            const totalBalance = accounts.reduce(
                (sum: number, account: BankAccount) =>
                    sum + (account.balances.current || 0),
                0
            );

            // TODO: Diese Werte sollten später aus der API kommen
            const monthlyIncome = 5000;
            const monthlyExpenses = 3500;

            setDashboardData({
                accounts,
                totalBalance,
                monthlyIncome,
                monthlyExpenses,
            });
        } catch (err) {
            setError('Fehler beim Laden der Daten');
            console.error('Dashboard Fehler:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        authApi.logout();
    };

    const renderOverview = () => {
        if (!dashboardData) return null;
        return (
            <div className='space-y-8'>
                {/* Übersichtskarten */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <GlassCard>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-400'>
                                    Gesamtvermögen
                                </p>
                                <p className='text-2xl font-bold text-white mt-1'>
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(dashboardData.totalBalance)}
                                </p>
                            </div>
                            <div className='p-3 bg-blue-500/20 rounded-lg'>
                                <FiDollarSign className='w-6 h-6 text-blue-400' />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-400'>
                                    Monatliche Einnahmen
                                </p>
                                <p className='text-2xl font-bold text-white mt-1'>
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(dashboardData.monthlyIncome)}
                                </p>
                            </div>
                            <div className='p-3 bg-green-500/20 rounded-lg'>
                                <FiTrendingUp className='w-6 h-6 text-green-400' />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-400'>
                                    Monatliche Ausgaben
                                </p>
                                <p className='text-2xl font-bold text-white mt-1'>
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(dashboardData.monthlyExpenses)}
                                </p>
                            </div>
                            <div className='p-3 bg-red-500/20 rounded-lg'>
                                <FiTrendingDown className='w-6 h-6 text-red-400' />
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Kontenübersicht */}
                <GlassCard>
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
                        <AccountGroups accounts={dashboardData.accounts} />
                    </div>
                </GlassCard>
            </div>
        );
    };

    const renderContracts = () => {
        return (
            <GlassCard>
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
            </GlassCard>
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
                        {activeTab === 'accounts' && dashboardData && (
                            <BankingPage
                                accounts={dashboardData.accounts}
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
