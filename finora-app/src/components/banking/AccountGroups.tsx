import React from 'react';
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

export const AccountGroups: React.FC<Props> = ({ accounts }) => {
    return (
        <div className='space-y-3'>
            {accounts.map((account) => {
                const BankIcon = getBankIcon(account.name);
                return (
                    <motion.div
                        key={account.id}
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
                                    <p className='text-white font-medium'>
                                        {account.name}
                                    </p>
                                    <p className='text-sm text-gray-400'>
                                        ****{account.mask}
                                    </p>
                                </div>
                            </div>
                            <div className='text-right'>
                                <p className='text-white font-medium'>
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency:
                                            account.balances.iso_currency_code,
                                    }).format(account.balances.current || 0)}
                                </p>
                                <p className='text-sm text-gray-400'>
                                    Verfügbar:{' '}
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency:
                                            account.balances.iso_currency_code,
                                    }).format(account.balances.available || 0)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
