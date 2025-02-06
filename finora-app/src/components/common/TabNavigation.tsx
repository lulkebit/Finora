import { ReactNode, memo, useCallback, useMemo } from 'react';

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

const TabButton = memo(
    ({
        tab,
        isActive,
        onClick,
    }: {
        tab: Tab;
        isActive: boolean;
        onClick: () => void;
    }) => {
        const buttonClasses = useMemo(
            () => `
        flex items-center px-1 py-4 border-b-2 font-medium text-sm
        ${
            isActive
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
        }
        transition-colors duration-200
    `,
            [isActive]
        );

        return (
            <button onClick={onClick} className={buttonClasses}>
                {tab.icon && <span className='mr-2'>{tab.icon}</span>}
                {tab.label}
            </button>
        );
    }
);

export const TabNavigation = memo(
    ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
        const createHandleClick = useCallback(
            (tabId: string) => () => {
                onTabChange(tabId);
            },
            [onTabChange]
        );

        return (
            <div className='border-b border-gray-800 mb-8'>
                <nav className='flex space-x-8'>
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            onClick={createHandleClick(tab.id)}
                        />
                    ))}
                </nav>
            </div>
        );
    }
);
