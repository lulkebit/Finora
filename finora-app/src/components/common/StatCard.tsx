import { IconType } from 'react-icons';
import { GlassCard } from './GlassCard';

interface StatCardProps {
    icon: IconType;
    iconBgColor: string;
    iconColor: string;
    label: string;
    value: string;
}

export function StatCard({
    icon: Icon,
    iconBgColor,
    iconColor,
    label,
    value,
}: StatCardProps) {
    return (
        <GlassCard>
            <div className='flex items-center'>
                <div className={`p-2 ${iconBgColor} rounded-lg`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-400'>{label}</p>
                    <h2 className='text-xl font-semibold text-white'>
                        {value}
                    </h2>
                </div>
            </div>
        </GlassCard>
    );
}
