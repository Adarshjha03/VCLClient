import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ problems, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedSolved, setSelectedSolved] = useState('');
    const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
    const [solvedDropdownOpen, setSolvedDropdownOpen] = useState(false);
    const difficultyRef = useRef(null);
    const solvedRef = useRef(null);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
        setDifficultyDropdownOpen(false);
    };

    const handleSolvedChange = (solved) => {
        setSelectedSolved(solved);
        setSolvedDropdownOpen(false);
    };

    useEffect(() => {
        const filteredProblems = problems.filter(problem => {
            const matchesSearchTerm = problem.name && problem.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDifficulty = selectedDifficulty === "" || problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
            const matchesSolved = selectedSolved === "" || 
                                  (selectedSolved === "SOLVED" && problem.solved) || 
                                  (selectedSolved === "UNSOLVED" && !problem.solved);
            return matchesSearchTerm && matchesDifficulty && matchesSolved;
        });
        onSearch(filteredProblems);
    }, [problems, searchTerm, selectedDifficulty, selectedSolved, onSearch]);

    return (
        <div className="flex justify-center mt-6">
            <div className="flex items-center bg-white rounded-md shadow-md p-2" style={{ minWidth: "600px" }}>
                <FaSearch className="ml-3 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="flex-grow px-4 py-2 border-transparent rounded-full focus:outline-none"
                />
                <div className="flex">
                    <div className="relative mx-2">
                        <button
                            onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
                            className="py-2 px-4 text-white text-sm font-semibold rounded-md bg-blue-600 focus:outline-none"
                            style={{ backgroundColor: "#000930", width: "120px", whiteSpace: "nowrap" }}
                        >
                            {selectedDifficulty || "ALL"} ▼
                        </button>
                        {difficultyDropdownOpen && (
                            <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg" ref={difficultyRef}>
                                <button
                                    onClick={() => handleDifficultyChange("HARD")}
                                    className="block w-full py-2 px-4 text-left hover:bg-gray-200"
                                >
                                    HARD
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("MEDIUM")}
                                    className="block w-full py-2 px-4 text-left hover:bg-gray-200"
                                >
                                    MEDIUM
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("EASY")}
                                    className="block w-full py-2 px-4 text-left hover:bg-gray-200"
                                >
                                    EASY
                                </button>
                                <button
                                    onClick={() => handleDifficultyChange("")}
                                    className="block w-full py-2 px-4 text-left hover:bg-gray-200"
                                >
                                    ALL
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative mx-2">
                        <button
                            onClick={() => setSolvedDropdownOpen(!solvedDropdownOpen)}
                            className="py-2 px-4 text-white text-sm font-semibold rounded-md bg-blue-600 focus:outline-none"
                            style={{ backgroundColor: "#000930", width: "120px", whiteSpace: "nowrap" }}
                        >
                            {selectedSolved || "ALL"} ▼
                        </button>
                        {solvedDropdownOpen && (
                            <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg" ref={solvedRef}>
                                <button
                                    onClick={() => handleSolvedChange("SOLVED")}
                                    className="block w-full py-2 px-4 text-left hover:bg-gray-200"
                                >
                                    SOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("UNSOLVED")}
                                    className="block w-full py-2 px-4 text-left hover:bg-gray-200"
                                >
                                    UNSOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("")}
                                    className="block w-full py-2 px-4 text-left hover:bg-gray-200"
                                >
                                    ALL
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
