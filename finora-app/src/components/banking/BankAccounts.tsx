import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import PlaidLink from '../PlaidLink';
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

export const BankAccounts: React.FC = () => {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [showPlaidLink, setShowPlaidLink] = useState(false);

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/plaid/accounts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAccounts(response.data.accounts);
        } catch (error) {
            console.error('Fehler beim Abrufen der Bankkonten:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handlePlaidSuccess = () => {
        setShowPlaidLink(false);
        fetchAccounts();
    };

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-white'>Bankkonten</h2>
                <button
                    onClick={() => setShowPlaidLink(true)}
                    className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                >
                    <FiPlus className='mr-2' />
                    Konto hinzufügen
                </button>
            </div>

            {showPlaidLink && (
                <div className='p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700'>
                    <h3 className='text-lg font-medium text-white mb-4'>
                        Bankkonto verbinden
                    </h3>
                    <PlaidLink
                        onSuccess={handlePlaidSuccess}
                        onExit={() => setShowPlaidLink(false)}
                    />
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {accounts && accounts.length > 0 ? (
                    accounts.map((account) => (
                        <motion.div
                            key={account.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700'
                        >
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='text-lg font-medium text-white'>
                                        {account.name}
                                    </h3>
                                    <p className='text-sm text-gray-400'>
                                        ****{account.mask}
                                    </p>
                                </div>
                                <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-900/50 text-blue-400'>
                                    {account.subtype}
                                </span>
                            </div>
                            <div className='space-y-2'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-400'>
                                        Verfügbar
                                    </span>
                                    <span className='text-white font-medium'>
                                        {new Intl.NumberFormat('de-DE', {
                                            style: 'currency',
                                            currency:
                                                account.balances
                                                    .iso_currency_code,
                                        }).format(
                                            account.balances.available || 0
                                        )}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-400'>
                                        Aktuell
                                    </span>
                                    <span className='text-white font-medium'>
                                        {new Intl.NumberFormat('de-DE', {
                                            style: 'currency',
                                            currency:
                                                account.balances
                                                    .iso_currency_code,
                                        }).format(
                                            account.balances.current || 0
                                        )}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className='col-span-full text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700'>
                        <p className='text-gray-400'>
                            Keine Bankkonten verfügbar
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
