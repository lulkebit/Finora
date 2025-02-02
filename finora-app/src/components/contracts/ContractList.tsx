import {
    FiCalendar,
    FiRepeat,
    FiArrowUpRight as FiTrendUp,
} from 'react-icons/fi';
import { GlassCard } from '../common/GlassCard';

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

    return (
        <div className='space-y-6'>
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
                    {sortedContracts.map((contract) => {
                        const config = categoryConfig[contract.category];
                        const Icon = config.icon;

                        return (
                            <div
                                key={contract.id}
                                className='flex items-center justify-between p-4 rounded-lg bg-black/30 hover:bg-white/5 transition-all duration-300'
                            >
                                <div className='flex items-center space-x-4'>
                                    <div
                                        className={`p-2 rounded-lg ${config.bgColorClass}`}
                                    >
                                        <Icon
                                            className={`h-5 w-5 ${config.colorClass}`}
                                        />
                                    </div>
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
                                <div className='text-right'>
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
                                        Nächste Zahlung: {contract.nextPayment}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </GlassCard>

            <GlassCard>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-medium text-white'>
                        Monatliche Übersicht
                    </h2>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='p-4 rounded-lg bg-black/30'>
                        <p className='text-sm text-gray-400 mb-1'>
                            Wiederkehrende Einnahmen
                        </p>
                        <p className='text-xl font-semibold text-green-400'>
                            {contracts
                                .filter((c) => c.amount > 0)
                                .reduce((sum, c) => sum + c.amount, 0)
                                .toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                })}
                        </p>
                    </div>
                    <div className='p-4 rounded-lg bg-black/30'>
                        <p className='text-sm text-gray-400 mb-1'>
                            Wiederkehrende Ausgaben
                        </p>
                        <p className='text-xl font-semibold text-red-400'>
                            {contracts
                                .filter((c) => c.amount < 0)
                                .reduce((sum, c) => sum + c.amount, 0)
                                .toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                })}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
