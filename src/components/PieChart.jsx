import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.category),
        datasets: [{
            data: data.map(item => item.num_labs),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
            hoverBackgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ]
        }]
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    boxWidth: 20,
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="flex items-center justify-center h-full space-x-2">
            <div className=" h-full">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};

export default PieChart;
