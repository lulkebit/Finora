import { GlassCard } from '../common/GlassCard';

interface Transaction {
    id: number;
    description: string;
    date: string;
    amount: number;
}

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    return (
        <GlassCard className='mb-8'>
            <div className='px-6 py-4 -m-6 border-b border-gray-800'>
                <h3 className='text-lg font-medium text-white'>
                    Letzte Transaktionen
                </h3>
            </div>
            <div className='divide-y divide-gray-800 -mx-6 -mb-6 mt-6'>
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className='px-6 py-4 hover:bg-white/5 transition-colors'
                    >
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='text-sm font-medium text-gray-300'>
                                    {transaction.description}
                                </p>
                                <p className='text-sm text-gray-500'>
                                    {transaction.date}
                                </p>
                            </div>
                            <span
                                className={`text-sm font-medium ${
                                    transaction.amount < 0
                                        ? 'text-red-400'
                                        : 'text-green-400'
                                }`}
                            >
                                {transaction.amount.toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
