import React from 'react';

interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value }) => {
    return (
        <div className="bg-neutral-dark p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="p-3 bg-neutral rounded-full">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
                <p className="text-sm text-gray-400 uppercase">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
