import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCreditCard,
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle,
    FiPlus,
} from 'react-icons/fi';
import { GlassCard } from '../common/GlassCard';
import { AccountGroups } from './AccountGroups';
import PlaidLink from '../PlaidLink';

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

interface BankingPageProps {
    accounts: BankAccount[];
    onAccountsUpdate: () => Promise<void>;
}

const MemoizedGlassCard = memo(GlassCard);
const MemoizedAccountGroups = memo(AccountGroups);

const StatsCard = memo(
    ({ label, value }: { label: string; value: string | number }) => (
        <div>
            <p className='text-sm text-gray-400'>{label}</p>
            <p className='text-2xl font-bold text-white mt-1'>{value}</p>
        </div>
    )
);

const UpdateStatus = memo(({ status }: { status: 'success' | 'error' }) => (
    <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className='flex items-center space-x-2 text-sm'
    >
        {status === 'success' ? (
            <>
                <FiCheckCircle className='w-4 h-4 text-green-400' />
                <span className='text-green-400'>Aktualisiert</span>
            </>
        ) : (
            <>
                <FiAlertCircle className='w-4 h-4 text-red-400' />
                <span className='text-red-400'>Fehler beim Aktualisieren</span>
            </>
        )}
    </motion.span>
));

export const BankingPage: React.FC<BankingPageProps> = memo(
    ({ accounts, onAccountsUpdate }) => {
        const [isUpdating, setIsUpdating] = useState(false);
        const [updateStatus, setUpdateStatus] = useState<
            'success' | 'error' | null
        >(null);

        const handlePlaidSuccess = useCallback(async () => {
            await onAccountsUpdate();
        }, [onAccountsUpdate]);

        const handleRefreshAccounts = useCallback(async () => {
            setIsUpdating(true);
            setUpdateStatus(null);
            try {
                await onAccountsUpdate();
                setUpdateStatus('success');
            } catch {
                setUpdateStatus('error');
            } finally {
                setIsUpdating(false);
                setTimeout(() => setUpdateStatus(null), 3000);
            }
        }, [onAccountsUpdate]);

        const uniqueBankCount = useMemo(
            () => new Set(accounts.map((acc) => acc.name)).size,
            [accounts]
        );

        const currentDateTime = useMemo(
            () => new Date().toLocaleString('de-DE'),
            []
        );

        return (
            <div className='space-y-6'>
                <MemoizedGlassCard>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <StatsCard
                            label='Aktive Bankverbindungen'
                            value={uniqueBankCount}
                        />
                        <StatsCard
                            label='Verknüpfte Konten'
                            value={accounts.length}
                        />
                        <StatsCard
                            label='Letzte Aktualisierung'
                            value={currentDateTime}
                        />
                    </div>
                </MemoizedGlassCard>

                <div className='flex justify-between items-center'>
                    <div className='flex items-center space-x-2'>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRefreshAccounts}
                            disabled={isUpdating}
                            className='px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-colors flex items-center space-x-2 disabled:opacity-50'
                        >
                            <FiRefreshCw
                                className={`w-4 h-4 ${
                                    isUpdating ? 'animate-spin' : ''
                                }`}
                            />
                            <span>Aktualisieren</span>
                        </motion.button>
                        <AnimatePresence>
                            {updateStatus && (
                                <UpdateStatus status={updateStatus} />
                            )}
                        </AnimatePresence>
                    </div>
                    <PlaidLink
                        onSuccess={handlePlaidSuccess}
                        onExit={() => {}}
                        className='flex items-center space-x-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 transition-colors'
                    >
                        <FiPlus className='w-4 h-4' />
                        <span>Bank hinzufügen</span>
                    </PlaidLink>
                </div>

                <MemoizedGlassCard>
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h2 className='text-xl font-semibold text-white'>
                                    Verknüpfte Bankkonten
                                </h2>
                                <p className='text-sm text-gray-400 mt-1'>
                                    Übersicht aller verbundenen Konten
                                </p>
                            </div>
                            <div className='flex items-center space-x-2 text-gray-400'>
                                <FiCreditCard className='w-5 h-5' />
                                <span>{accounts.length} Konten</span>
                            </div>
                        </div>
                        {accounts.length > 0 ? (
                            <MemoizedAccountGroups accounts={accounts} />
                        ) : (
                            <div className='text-center py-8'>
                                <p className='text-gray-400'>
                                    Keine Bankkonten verknüpft
                                </p>
                                <p className='text-sm text-gray-500 mt-2'>
                                    Klicken Sie auf "Bank hinzufügen" um Ihre
                                    erste Bankverbindung einzurichten
                                </p>
                            </div>
                        )}
                    </div>
                </MemoizedGlassCard>
            </div>
        );
    }
);
