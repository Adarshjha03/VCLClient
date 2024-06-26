import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchUsers = ({ users, backendUrl }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        
        const results = users.filter(user =>
            user.first_name.toLowerCase().includes(term) ||
            user.last_name.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term)
        ).slice(0, 3); // Limit to top 5 matching elements
        
        setFilteredUsers(results);
    };

    const handleUserClick = (username) => {
        navigate(`/profile/${username}`);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <input
                type="text"
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 mb-4 border rounded"
            />
            <ul>
                {filteredUsers.map(user => (
                    <li
                        key={user.id}
                        className="p-2 border-b cursor-pointer"
                        onClick={() => handleUserClick(user.username)}
                    >
                        <div className="flex items-center">
                            <img
                                src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`}
                                alt={`${user.first_name} ${user.last_name}`}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <div className="font-bold">{user.first_name} {user.last_name}</div>
                                <div>{user.username}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchUsers;
