import { ReactNode } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export function TabNavigation({
    tabs,
    activeTab,
    onTabChange,
}: TabNavigationProps) {
    return (
        <div className='border-b border-gray-800 mb-8'>
            <nav className='flex space-x-8'>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex items-center px-1 py-4 border-b-2 font-medium text-sm
                            ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            }
                            transition-colors duration-200
                        `}
                    >
                        {tab.icon && <span className='mr-2'>{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
