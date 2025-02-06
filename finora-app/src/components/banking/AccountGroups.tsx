import React, { memo, useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiTrash2 } from 'react-icons/fi';
import { SiDeutschebank, SiSparkasse } from 'react-icons/si';
import { BsBank2 } from 'react-icons/bs';
import { ConfirmDialog } from '../common/ConfirmDialog';
import axios from 'axios';

interface BankAccount {
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
}

interface Props {
    accounts: BankAccount[];
    onAccountsUpdate: () => Promise<void>;
}

const getBankIcon = (bankName: string) => {
    const name = bankName.toLowerCase();
    if (name.includes('deutsche bank')) return SiDeutschebank;
    if (name.includes('sparkasse')) return SiSparkasse;
    if (name.includes('volksbank') || name.includes('raiffeisen'))
        return BsBank2;
    return FiCreditCard;
};

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: currency,
    }).format(amount || 0);
};

const AccountItem = memo(
    ({
        account,
        onAccountsUpdate,
    }: {
        account: BankAccount;
        onAccountsUpdate: () => Promise<void>;
    }) => {
        const [isRemoving, setIsRemoving] = useState(false);
        const [showConfirmDialog, setShowConfirmDialog] = useState(false);
        const BankIcon = useMemo(
            () => getBankIcon(account.name),
            [account.name]
        );

        const handleRemoveAccount = async () => {
            setShowConfirmDialog(true);
        };

        const handleConfirmRemove = async () => {
            setShowConfirmDialog(false);
            setIsRemoving(true);
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/plaid/unlink-account/${account.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                await onAccountsUpdate();
            } catch (error) {
                console.error('Fehler beim Entfernen des Kontos:', error);
            } finally {
                setIsRemoving(false);
            }
        };

        const formattedCurrentBalance = useMemo(
            () =>
                formatCurrency(
                    account.balances.current,
                    account.balances.iso_currency_code
                ),
            [account.balances.current, account.balances.iso_currency_code]
        );

        const formattedAvailableBalance = useMemo(
            () =>
                formatCurrency(
                    account.balances.available,
                    account.balances.iso_currency_code
                ),
            [account.balances.available, account.balances.iso_currency_code]
        );

        return (
            <>
                <ConfirmDialog
                    isOpen={showConfirmDialog}
                    title='Konto entfernen'
                    message={`Möchten Sie das Konto "${account.name}" wirklich entfernen? Diese Aktion kann nicht rückgängig gemacht werden.`}
                    confirmText='Ja, entfernen'
                    cancelText='Abbrechen'
                    onConfirm={handleConfirmRemove}
                    onCancel={() => setShowConfirmDialog(false)}
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700/50'
                >
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center space-x-3'>
                            <div className='p-2 bg-gray-700/50 rounded-lg'>
                                <BankIcon className='w-5 h-5 text-blue-400' />
                            </div>
                            <div>
                                <p className='text-white font-medium'>
                                    {account.name}
                                </p>
                                <p className='text-sm text-gray-400'>
                                    ****{account.mask}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <div className='text-right'>
                                <p className='text-white font-medium'>
                                    {formattedCurrentBalance}
                                </p>
                                <p className='text-sm text-gray-400'>
                                    Verfügbar: {formattedAvailableBalance}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleRemoveAccount}
                                disabled={isRemoving}
                                className='p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50'
                                title='Konto entfernen'
                            >
                                <FiTrash2 className='w-5 h-5' />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </>
        );
    }
);

export const AccountGroups: React.FC<Props> = memo(
    ({ accounts, onAccountsUpdate }) => {
        return (
            <div className='space-y-3'>
                <AnimatePresence>
                    {accounts.map((account) => (
                        <AccountItem
                            key={account.id}
                            account={account}
                            onAccountsUpdate={onAccountsUpdate}
                        />
                    ))}
                </AnimatePresence>
            </div>
        );
    }
);
