import {
    FiCalendar,
    FiRepeat,
    FiArrowUpRight as FiTrendUp,
} from 'react-icons/fi';
import { GlassCard } from '../common/GlassCard';
import { motion } from 'framer-motion';

interface Contract {
    id: number;
    name: string;
    category: 'income' | 'subscription' | 'insurance' | 'utility';
    amount: number;
    interval: 'monthly' | 'yearly' | 'quarterly';
    nextPayment: string;
    provider?: string;
}

interface ContractListProps {
    contracts: Contract[];
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

export function ContractList({ contracts }: ContractListProps) {
    const sortedContracts = [...contracts].sort(
        (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
    );

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
        <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='space-y-6'
        >
            <motion.div variants={itemVariants}>
                <GlassCard>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-xl font-semibold text-white'>
                            Erkannte Verträge & Zahlungen
                        </h2>
                        <span className='text-sm text-gray-400'>
                            {contracts.length} Aktiv
                        </span>
                    </div>

                    <div className='space-y-4'>
                        {sortedContracts.map((contract, index) => {
                            const config = categoryConfig[contract.category];
                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={contract.id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className='flex items-center justify-between p-4 rounded-lg bg-black/30 hover:bg-white/5 transition-all duration-300'
                                >
                                    <div className='flex items-center space-x-4'>
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                            className={`p-2 rounded-lg ${config.bgColorClass}`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${config.colorClass}`}
                                            />
                                        </motion.div>
                                        <div>
                                            <h3 className='text-white font-medium'>
                                                {contract.name}
                                            </h3>
                                            <div className='flex items-center space-x-2 text-sm text-gray-400'>
                                                <span>
                                                    {
                                                        intervalLabels[
                                                            contract.interval
                                                        ]
                                                    }
                                                </span>
                                                {contract.provider && (
                                                    <>
                                                        <span>•</span>
                                                        <span>
                                                            {contract.provider}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className='text-right'
                                    >
                                        <p
                                            className={`font-semibold ${
                                                contract.amount >= 0
                                                    ? 'text-green-400'
                                                    : 'text-red-400'
                                            }`}
                                        >
                                            {contract.amount.toLocaleString(
                                                'de-DE',
                                                {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                }
                                            )}
                                        </p>
                                        <p className='text-sm text-gray-400'>
                                            Nächste Zahlung:{' '}
                                            {contract.nextPayment}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <GlassCard>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-lg font-medium text-white'>
                            Monatliche Übersicht
                        </h2>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className='p-4 rounded-lg bg-black/30'
                        >
                            <p className='text-sm text-gray-400 mb-1'>
                                Wiederkehrende Einnahmen
                            </p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className='text-xl font-semibold text-green-400'
                            >
                                {contracts
                                    .filter((c) => c.amount > 0)
                                    .reduce((sum, c) => sum + c.amount, 0)
                                    .toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })}
                            </motion.p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className='p-4 rounded-lg bg-black/30'
                        >
                            <p className='text-sm text-gray-400 mb-1'>
                                Wiederkehrende Ausgaben
                            </p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className='text-xl font-semibold text-red-400'
                            >
                                {contracts
                                    .filter((c) => c.amount < 0)
                                    .reduce((sum, c) => sum + c.amount, 0)
                                    .toLocaleString('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    })}
                            </motion.p>
                        </motion.div>
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
}
