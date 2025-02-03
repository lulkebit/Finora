import { useState, useEffect } from 'react';
import {
    FiLogOut,
    FiPieChart,
    FiDollarSign,
    FiCreditCard,
    FiGrid,
    FiFileText,
} from 'react-icons/fi';
import { StatCard } from './common/StatCard';
import { TransactionList } from './transactions/TransactionList';
import { CategoryGrid } from './categories/CategoryGrid';
import { ContractList } from './contracts/ContractList';
import { TabNavigation } from './common/TabNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../services/api';

// Beispieldaten (später durch echte Daten ersetzen)
const mockTransactions = [
    {
        id: 1,
        description: 'Supermarkt Einkauf',
        date: '01.02.2024',
        amount: -24.99,
    },
    { id: 2, description: 'Restaurant', date: '31.01.2024', amount: -45.8 },
    { id: 3, description: 'Gehalt', date: '30.01.2024', amount: 2800.0 },
];

const mockCategories = [
    { name: 'Lebensmittel', amount: 350.0 },
    { name: 'Transport', amount: 150.0 },
    { name: 'Unterhaltung', amount: 200.0 },
    { name: 'Wohnen', amount: 800.0 },
];

type Contract = {
    id: number;
    name: string;
    category: 'income' | 'subscription' | 'insurance' | 'utility';
    amount: number;
    interval: 'monthly' | 'yearly' | 'quarterly';
    nextPayment: string;
    provider?: string;
};

const mockContracts: Contract[] = [
    {
        id: 1,
        name: 'Gehalt',
        category: 'income',
        amount: 2800.0,
        interval: 'monthly',
        nextPayment: '28.02.2024',
        provider: 'Firma XYZ GmbH',
    },
    {
        id: 2,
        name: 'Netflix',
        category: 'subscription',
        amount: -12.99,
        interval: 'monthly',
        nextPayment: '15.02.2024',
        provider: 'Netflix International',
    },
    {
        id: 3,
        name: 'Haftpflichtversicherung',
        category: 'insurance',
        amount: -59.99,
        interval: 'yearly',
        nextPayment: '01.04.2024',
        provider: 'Allianz',
    },
    {
        id: 4,
        name: 'Stromvertrag',
        category: 'utility',
        amount: -85.0,
        interval: 'monthly',
        nextPayment: '01.02.2024',
        provider: 'Stadtwerke',
    },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);
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
                    {activeTab === 'overview' && (
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
                                        value='€2,543.00'
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={FiCreditCard}
                                        iconBgColor='bg-green-900/50'
                                        iconColor='text-green-400'
                                        label='Monatliche Ausgaben'
                                        value='€1,245.00'
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <StatCard
                                        icon={FiPieChart}
                                        iconBgColor='bg-purple-900/50'
                                        iconColor='text-purple-400'
                                        label='Sparquote'
                                        value='32%'
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <TransactionList
                                    transactions={mockTransactions}
                                />
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <CategoryGrid categories={mockCategories} />
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'contracts' && (
                        <motion.div
                            key='contracts'
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ContractList contracts={mockContracts} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
