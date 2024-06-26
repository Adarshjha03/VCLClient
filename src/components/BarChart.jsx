import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarChart = ({ data }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(user => user.username),
                datasets: [
                    {
                        label: 'Total Points',
                        data: data.map(user => user.total_points),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(199, 199, 199, 0.2)',
                            'rgba(83, 102, 255, 0.2)',
                            'rgba(155, 159, 64, 0.2)',
                            'rgba(45, 199, 199, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(199, 199, 199, 1)',
                            'rgba(83, 102, 255, 1)',
                            'rgba(155, 159, 64, 1)',
                            'rgba(45, 199, 199, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                layout: {
                    padding: {
                        top: 30 // Add padding to the top to prevent avatars from being cut off
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            plugins: [
                {
                    id: 'avatarPlugin',
                    afterDatasetsDraw: (chart, args, options) => {
                        const { ctx } = chart;
                        chart.data.datasets[0].data.forEach((value, index) => {
                            const avatarUrl = `https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${data[index].avatar}.png`;
                            const image = new Image();
                            image.src = avatarUrl;
                            image.onload = () => {
                                const bar = chart.getDatasetMeta(0).data[index];
                                const x = bar.x;
                                const y = bar.y - 10;
                                const width = 20;
                                const height = 20;
                                ctx.drawImage(image, x - width / 2, y - height, width, height);
                            };
                        });
                    }
                }
            ]
        });

        return () => {
            chart.destroy();
        };
    }, [data]);

    return (
        <div className="h-full w-full p-2">
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default BarChart;
