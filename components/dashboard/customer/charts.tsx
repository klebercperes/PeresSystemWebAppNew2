import React from 'react';
import type { ChartDataItem } from '../../../types';

interface ChartProps {
    data: ChartDataItem[];
}

export const PieChart: React.FC<ChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-gray-500">No ticket data available.</div>;

    let cumulativePercent = 0;
    const segments = data.map(item => {
        const percent = (item.value / total) * 100;
        const startAngle = (cumulativePercent / 100) * 360;
        cumulativePercent += percent;
        const endAngle = (cumulativePercent / 100) * 360;

        const largeArcFlag = percent > 50 ? 1 : 0;
        const startX = 50 + 40 * Math.cos(Math.PI * (startAngle / 180));
        const startY = 50 + 40 * Math.sin(Math.PI * (startAngle / 180));
        const endX = 50 + 40 * Math.cos(Math.PI * (endAngle / 180));
        const endY = 50 + 40 * Math.sin(Math.PI * (endAngle / 180));
        
        return {
            d: `M50,50 L${startX},${startY} A40,40 0 ${largeArcFlag},1 ${endX},${endY} Z`,
            color: item.color,
            label: `${item.label}: ${item.value}`
        };
    });

    return (
        <div className="flex items-center">
            <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90">
                {segments.map((segment, index) => (
                    <path key={index} d={segment.d} fill={segment.color}>
                         <title>{segment.label}</title>
                    </path>
                ))}
            </svg>
            <div className="ml-6 space-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-gray-600 dark:text-gray-300">{item.label}:</span>
                        <span className="font-semibold ml-1 text-gray-800 dark:text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const BarChart: React.FC<ChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-gray-500">No asset data available.</div>;

    const maxValue = Math.max(...data.map(item => item.value), 1);

    return (
        <div className="space-y-3 pt-4">
            {data.map(item => (
                <div key={item.label} className="flex items-center">
                    <span className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate pr-2">{item.label}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-neutral rounded-full h-6 relative">
                        <div 
                            className="h-6 rounded-full flex items-center justify-end pr-2" 
                            style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
                        >
                             <span className="text-xs font-bold text-white shadow-sm">{item.value}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};