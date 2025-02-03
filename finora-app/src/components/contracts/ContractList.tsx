import {
    FiCalendar,
    FiRepeat,
    FiArrowUpRight as FiTrendUp,
} from 'react-icons/fi';
import { GlassCard } from '../common/GlassCard';
import { motion } from 'framer-motion';
import { Contract } from '../../types';

interface ContractListProps {
    contracts: Contract[];
    fullWidth?: boolean;
}

const categoryConfig = {
    income: {
        label: 'Einkommen',
        icon: FiTrendUp,
        colorClass: 'text-green-400',
        bgColorClass: 'bg-green-900/30',
    },
    subscription: {
        label: 'Abonnement',
        icon: FiRepeat,
        colorClass: 'text-blue-400',
        bgColorClass: 'bg-blue-900/30',
    },
    insurance: {
        label: 'Versicherung',
        icon: FiCalendar,
        colorClass: 'text-purple-400',
        bgColorClass: 'bg-purple-900/30',
    },
    utility: {
        label: 'Versorgung',
        icon: FiCalendar,
        colorClass: 'text-orange-400',
        bgColorClass: 'bg-orange-900/30',
    },
};

const intervalLabels = {
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    quarterly: 'Vierteljährlich',
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
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

export function ContractList({
    contracts,
    fullWidth = false,
}: ContractListProps) {
    const sortedContracts = [...contracts].sort(
        (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
    );

    return (
        <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className={`grid gap-6 ${
                fullWidth ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
            }`}
        >
            {sortedContracts.map((contract) => (
                <motion.div
                    key={contract.id}
                    variants={itemVariants}
                    className='bg-gray-800/50 rounded-lg p-4 border border-gray-700'
                >
                    <div className='flex justify-between items-start mb-2'>
                        <div>
                            <h4 className='text-white font-medium'>
                                {contract.name}
                            </h4>
                            <p className='text-gray-400 text-sm'>
                                {contract.provider}
                            </p>
                        </div>
                        <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                                contract.category === 'income'
                                    ? 'bg-green-900/50 text-green-400'
                                    : contract.category === 'subscription'
                                    ? 'bg-blue-900/50 text-blue-400'
                                    : contract.category === 'insurance'
                                    ? 'bg-purple-900/50 text-purple-400'
                                    : 'bg-orange-900/50 text-orange-400'
                            }`}
                        >
                            {contract.category === 'income'
                                ? 'Einkommen'
                                : contract.category === 'subscription'
                                ? 'Abonnement'
                                : contract.category === 'insurance'
                                ? 'Versicherung'
                                : 'Nebenkosten'}
                        </span>
                    </div>
                    <div className='flex justify-between items-center text-sm'>
                        <div className='text-gray-400'>
                            {contract.interval === 'monthly'
                                ? 'Monatlich'
                                : contract.interval === 'yearly'
                                ? 'Jährlich'
                                : 'Vierteljährlich'}
                        </div>
                        <div
                            className={`font-medium ${
                                contract.amount >= 0
                                    ? 'text-green-400'
                                    : 'text-red-400'
                            }`}
                        >
                            {contract.amount.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                            })}
                        </div>
                    </div>
                    <div className='mt-2 text-xs text-gray-500'>
                        Nächste Zahlung: {contract.nextPayment}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
