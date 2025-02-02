import { GlassCard } from '../common/GlassCard';

interface Category {
    name: string;
    amount: number;
}

interface CategoryGridProps {
    categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
    return (
        <GlassCard>
            <div className='px-6 py-4 -m-6 border-b border-gray-800'>
                <h3 className='text-lg font-medium text-white'>Kategorien</h3>
            </div>
            <div className='p-6 -m-6 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
                {categories.map((category) => (
                    <div
                        key={category.name}
                        className='bg-black/30 backdrop-blur-sm rounded-lg p-4 hover:bg-white/5 transition-all duration-300'
                    >
                        <p className='text-sm font-medium text-gray-400'>
                            {category.name}
                        </p>
                        <p className='text-lg font-semibold text-white mt-1'>
                            {category.amount.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                            })}
                        </p>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
