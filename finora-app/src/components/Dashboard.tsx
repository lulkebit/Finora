import { useState } from 'react';
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

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900'>
            {/* Navigation */}
            <nav className='backdrop-blur-md bg-black/30 border-b border-gray-800'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex-shrink-0'>
                            <h1 className='text-xl font-semibold text-white'>
                                Finora
                            </h1>
                        </div>
                        <button
                            onClick={() => (window.location.href = '/login')}
                            className='flex items-center text-gray-300 hover:text-white transition-colors'
                        >
                            <FiLogOut className='mr-2' />
                            <span>Abmelden</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {activeTab === 'overview' && (
                    <>
                        {/* Overview Cards */}
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                            <StatCard
                                icon={FiDollarSign}
                                iconBgColor='bg-blue-900/50'
                                iconColor='text-blue-400'
                                label='Kontostand'
                                value='€2,543.00'
                            />
                            <StatCard
                                icon={FiCreditCard}
                                iconBgColor='bg-green-900/50'
                                iconColor='text-green-400'
                                label='Monatliche Ausgaben'
                                value='€1,245.00'
                            />
                            <StatCard
                                icon={FiPieChart}
                                iconBgColor='bg-purple-900/50'
                                iconColor='text-purple-400'
                                label='Sparquote'
                                value='32%'
                            />
                        </div>

                        <TransactionList transactions={mockTransactions} />
                        <CategoryGrid categories={mockCategories} />
                    </>
                )}

                {activeTab === 'contracts' && (
                    <ContractList contracts={mockContracts} />
                )}
            </main>
        </div>
    );
}
