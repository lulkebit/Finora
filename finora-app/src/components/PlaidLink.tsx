import React, { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios, { AxiosError } from 'axios';

interface PlaidLinkProps {
    onSuccess?: () => void;
    onExit?: () => void;
}

interface PlaidErrorResponse {
    message?: string;
}

export const PlaidLink: React.FC<PlaidLinkProps> = ({ onSuccess, onExit }) => {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateToken = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/plaid/create-link-token',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.link_token) {
                setLinkToken(response.data.link_token);
            } else {
                setError('Keine Link-Token in der Antwort');
                console.error(
                    'Keine Link-Token in der Antwort:',
                    response.data
                );
            }
        } catch (err) {
            const error = err as AxiosError<PlaidErrorResponse>;
            const errorMessage =
                error.response?.data?.message ||
                'Fehler beim Generieren des Link-Tokens';
            setError(errorMessage);
            console.error('Error generating link token:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onPlaidSuccess = useCallback(
        async (publicToken: string) => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                await axios.post(
                    '/api/plaid/set-access-token',
                    { public_token: publicToken },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                onSuccess?.();
            } catch (err) {
                const error = err as AxiosError<PlaidErrorResponse>;
                const errorMessage =
                    error.response?.data?.message ||
                    'Fehler beim Setzen des Access-Tokens';
                setError(errorMessage);
                console.error('Error setting access token:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [onSuccess]
    );

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token) => onPlaidSuccess(public_token),
        onExit: () => {
            onExit?.();
        },
    });

    React.useEffect(() => {
        generateToken();
    }, []);

    return (
        <div className='space-y-4'>
            <button
                onClick={() => open()}
                disabled={!ready || isLoading}
                className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
                {isLoading ? (
                    <span className='flex items-center justify-center'>
                        <svg
                            className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                        Wird geladen...
                    </span>
                ) : (
                    'Mit Sparkasse verbinden'
                )}
            </button>
            {error && (
                <div className='text-red-500 text-sm text-center'>{error}</div>
            )}
        </div>
    );
};

export default PlaidLink;
