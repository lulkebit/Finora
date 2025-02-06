import { ReactNode, memo, useMemo } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export const GlassCard = memo(
    ({ children, className = '' }: GlassCardProps) => {
        const cardClasses = useMemo(
            () =>
                `backdrop-blur-lg bg-white/10 rounded-xl border border-gray-800 p-6 hover:bg-white/20 transition-all duration-300 ${className}`,
            [className]
        );

        return <div className={cardClasses}>{children}</div>;
    }
);
