import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
    return (
        <div
            className={`backdrop-blur-lg bg-white/10 rounded-xl border border-gray-800 p-6 hover:bg-white/20 transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}
