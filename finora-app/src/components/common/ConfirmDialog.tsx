import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Bestätigen',
    cancelText = 'Abbrechen',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className='fixed inset-0 z-50 flex items-center justify-center'>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 bg-black/50 backdrop-blur-sm'
                    onClick={onCancel}
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className='relative bg-gray-800/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-700'
                >
                    <div className='flex items-start space-x-4'>
                        <div className='flex-shrink-0'>
                            <div className='p-2 bg-yellow-500/10 rounded-full'>
                                <FiAlertTriangle className='w-6 h-6 text-yellow-500' />
                            </div>
                        </div>
                        <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-white mb-2'>
                                {title}
                            </h3>
                            <p className='text-gray-300 mb-6'>{message}</p>
                            <div className='flex justify-end space-x-3'>
                                <button
                                    onClick={onCancel}
                                    className='px-4 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg transition-colors'
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className='px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors'
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
