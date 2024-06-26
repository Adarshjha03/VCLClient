import React from "react";

const TopLabsTable = ({ data }) => {
    return (
        <div className="h-full flex items-center justify-center">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200">Category</th>
                        <th className="py-2 px-4 border-b border-gray-200">Lab Most Solved</th>
                        <th className="py-2 px-4 border-b border-gray-200">Num Solves</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b border-gray-200">{item.category}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.top_lab ? item.top_lab.lab_name : "N/A"}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.top_lab ? item.top_lab.num_solves : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopLabsTable;
