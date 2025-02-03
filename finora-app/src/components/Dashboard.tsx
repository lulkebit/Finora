import { useState, useEffect } from 'react';
import {
    FiLogOut,
    FiPieChart,
    FiDollarSign,
    FiCreditCard,
    FiGrid,
    FiFileText,
    FiDatabase,
} from 'react-icons/fi';
import { StatCard } from './common/StatCard';
import { TransactionList } from './transactions/TransactionList';
import { CategoryGrid } from './categories/CategoryGrid';
import { ContractList } from './contracts/ContractList';
import { TabNavigation } from './common/TabNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi, dashboardApi } from '../services/api';
import { BankAccounts } from './banking/BankAccounts';

type Transaction = {
    id: number;
    description: string;
    date: string;
    amount: number;
};

type Category = {
    name: string;
    amount: number;
};

type Contract = {
    id: number;
    name: string;
    category: 'income' | 'subscription' | 'insurance' | 'utility';
    amount: number;
    interval: 'monthly' | 'yearly' | 'quarterly';
    nextPayment: string;
    provider?: string;
};

type DashboardData = {
    balance: number;
    monthlyExpenses: number;
    savingsRate: number;
    transactions: Transaction[];
    categories: Category[];
    contracts: Contract[];
};

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [overview, transactions, categories, contracts] =
                    await Promise.all([
                        dashboardApi.getOverview(),
                        dashboardApi.getTransactions(),
                        dashboardApi.getCategories(),
                        dashboardApi.getContracts(),
                    ]);

                setDashboardData({
                    balance: overview.balance,
                    monthlyExpenses: overview.monthlyExpenses,
                    savingsRate: overview.savingsRate,
                    transactions,
                    categories,
                    contracts,
                });
            } catch (err) {
                setError('Fehler beim Laden der Daten');
                console.error('Dashboard Fehler:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        authApi.logout();
    };

    const tabs = [
        {
            id: 'overview',
            label: 'Übersicht',
            icon: <FiGrid className='w-4 h-4' />,
        },
        {
            id: 'banking',
            label: 'Bankkonten',
            icon: <FiDatabase className='w-4 h-4' />,
        },
        {
            id: 'contracts',
            label: 'Verträge',
            icon: <FiFileText className='w-4 h-4' />,
        },
    ];

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

            <motion.main
                initial='hidden'
                animate='visible'
                variants={containerVariants}
                className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'
            >
                <motion.div variants={itemVariants}>
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </motion.div>

                <AnimatePresence mode='wait'>
                    {activeTab === 'overview' && dashboardData && (
                        <motion.div
                            key='overview'
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                variants={containerVariants}
                                className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
                            >
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={FiDollarSign}
                                        iconBgColor='bg-blue-900/50'
                                        iconColor='text-blue-400'
                                        label='Kontostand'
                                        value={`€${dashboardData.balance.toLocaleString(
                                            'de-DE',
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}`}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={FiCreditCard}
                                        iconBgColor='bg-green-900/50'
                                        iconColor='text-green-400'
                                        label='Monatliche Ausgaben'
                                        value={`€${dashboardData.monthlyExpenses.toLocaleString(
                                            'de-DE',
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}`}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={FiPieChart}
                                        iconBgColor='bg-purple-900/50'
                                        iconColor='text-purple-400'
                                        label='Sparquote'
                                        value={`${dashboardData.savingsRate}%`}
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                                    <div className='bg-black/30 backdrop-blur-md rounded-lg p-6 border border-gray-800'>
                                        <h3 className='text-lg font-semibold text-white mb-4'>
                                            Letzte Transaktionen
                                        </h3>
                                        <TransactionList
                                            transactions={
                                                dashboardData.transactions
                                            }
                                        />
                                    </div>
                                    <div className='bg-black/30 backdrop-blur-md rounded-lg p-6 border border-gray-800'>
                                        <h3 className='text-lg font-semibold text-white mb-4'>
                                            Ausgaben nach Kategorien
                                        </h3>
                                        <CategoryGrid
                                            categories={
                                                dashboardData.categories
                                            }
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className='mt-6'
                            >
                                <div className='bg-black/30 backdrop-blur-md rounded-lg p-6 border border-gray-800'>
                                    <h3 className='text-lg font-semibold text-white mb-4'>
                                        Aktive Verträge
                                    </h3>
                                    <ContractList
                                        contracts={dashboardData.contracts}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'banking' && (
                        <motion.div
                            key='banking'
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <BankAccounts />
                        </motion.div>
                    )}

                    {activeTab === 'contracts' && dashboardData && (
                        <motion.div
                            key='contracts'
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className='bg-black/30 backdrop-blur-md rounded-lg p-6 border border-gray-800'
                        >
                            <ContractList
                                contracts={dashboardData.contracts}
                                fullWidth
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
