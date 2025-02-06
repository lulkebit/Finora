import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';
import { SiDeutschebank, SiSparkasse } from 'react-icons/si';
import { BsBank2 } from 'react-icons/bs';

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

const AccountItem = memo(({ account }: { account: BankAccount }) => {
    const BankIcon = useMemo(() => getBankIcon(account.name), [account.name]);

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700/50'
        >
            <div className='flex justify-between items-center'>
                <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-gray-700/50 rounded-lg'>
                        <BankIcon className='w-5 h-5 text-blue-400' />
                    </div>
                    <div>
                        <p className='text-white font-medium'>{account.name}</p>
                        <p className='text-sm text-gray-400'>
                            ****{account.mask}
                        </p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-white font-medium'>
                        {formattedCurrentBalance}
                    </p>
                    <p className='text-sm text-gray-400'>
                        Verfügbar: {formattedAvailableBalance}
                    </p>
                </div>
            </div>
        </motion.div>
    );
});

export const AccountGroups: React.FC<Props> = memo(({ accounts }) => {
    return (
        <div className='space-y-3'>
            {accounts.map((account) => (
                <AccountItem key={account.id} account={account} />
            ))}
        </div>
    );
});
