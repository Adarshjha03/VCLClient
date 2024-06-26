import React from 'react';

const TopLabsTable = ({ data }) => {
    return (
        <table className="w-full table-auto bg-transparent">
            <thead>
                <tr>
                    <th className=" border-y px-4 py-2">Category</th>
                    <th className="border-y px-4 py-2 text-center">Lab Most Solved</th>
                    <th className="border-y px-4 py-2 text-right">Num Solves</th>
                </tr>
            </thead>
            <tbody>
                {data.map((lab, index) => (
                    <tr key={index}>
                        <td className="border-y px-4 py-2">{lab.category}</td>
                        <td className="border-y px-4 py-2 text-center">{lab.top_lab.lab_name}</td>
                        <td className="border-y px-4 py-2 text-right">{lab.top_lab.num_solves}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TopLabsTable;
