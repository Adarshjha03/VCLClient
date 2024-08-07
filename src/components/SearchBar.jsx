import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const HIGH_Z_INDEX = 2001;

const SearchBar = ({ problems, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedSolved, setSelectedSolved] = useState('');
    const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
    const [solvedDropdownOpen, setSolvedDropdownOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const difficultyRef = useRef(null);
    const solvedRef = useRef(null);
    const filterRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (difficultyRef.current && !difficultyRef.current.contains(event.target)) {
                setDifficultyDropdownOpen(false);
            }
            if (solvedRef.current && !solvedRef.current.contains(event.target)) {
                setSolvedDropdownOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const buttonStyles = (color) => ({
        background: hoveredButton === color ? color : 'white',
        transition: 'all 0.3s ease',
        width: '100px',
        whiteSpace: 'nowrap',
    });

    const hoverStyles = {
        hard: 'linear-gradient(to right, #f43150, #f2512e)',
        medium: 'linear-gradient(to right, #f95b37, #fca339)',
        easy: 'linear-gradient(to right, #26c585, #24c6c0)',
    };

    return (
        <div className="flex justify-center mt-6" style={{ zIndex: HIGH_Z_INDEX, position: 'relative' }}>
            <div className="flex items-center bg-white rounded-md shadow-md p-2 w-full max-w-2xl" style={{ zIndex: HIGH_Z_INDEX }}>
                <FaSearch className="ml-3 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="flex-grow px-4 py-2 border-transparent rounded-full focus:outline-none"
                />
                <div className="flex md:hidden ml-2 relative" style={{ zIndex: HIGH_Z_INDEX }}>
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="py-2 px-2 text-white bg-blue-600 rounded-md focus:outline-none"
                    >
                        <FaFilter />
                    </button>
                    {filterOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg" style={{ zIndex: HIGH_Z_INDEX }} ref={filterRef}>
                            <div className="px-4 py-2">
                                <button
                                    onMouseEnter={() => setHoveredButton(hoverStyles.hard)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => handleDifficultyChange("HARD")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                    style={buttonStyles(hoverStyles.hard)}
                                >
                                    HARD
                                </button>
                                <button
                                    onMouseEnter={() => setHoveredButton(hoverStyles.medium)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => handleDifficultyChange("MEDIUM")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                    style={buttonStyles(hoverStyles.medium)}
                                >
                                    MEDIUM
                                </button>
                                <button
                                    onMouseEnter={() => setHoveredButton(hoverStyles.easy)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => handleDifficultyChange("EASY")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                    style={buttonStyles(hoverStyles.easy)}
                                >
                                    EASY
                                </button>
                                <button
                                   onMouseLeave={() => setHoveredButton(null)}
                                   onClick={() => handleDifficultyChange("")}
                                   className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                >
                                    ALL Difficulty
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("SOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                >
                                    SOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("UNSOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                >
                                    UNSOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                >
                                    SOLVED & UNSOLVED
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:block md:flex hidden" style={{ zIndex: HIGH_Z_INDEX }}>
                    <div className="relative mx-2" style={{ zIndex: HIGH_Z_INDEX }}>
                        <button
                            onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
                            className="py-2 px-2 text-white text-xs font-medium rounded-md bg-blue-600 focus:outline-none"
                            style={{ backgroundColor: "#000930", width: "100px", whiteSpace: "nowrap" }}
                        >
                            {selectedDifficulty || "ALL"} ▼
                        </button>
                        {difficultyDropdownOpen && (
                            <div className="absolute mt-2 w-100 items-center bg-white rounded-lg shadow-lg" style={{ zIndex: HIGH_Z_INDEX }} ref={difficultyRef}>
                                <button
                                    onMouseEnter={() => setHoveredButton(hoverStyles.hard)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => handleDifficultyChange("HARD")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                    style={buttonStyles(hoverStyles.hard)}
                                >
                                    HARD
                                </button>
                                <button
                                    onMouseEnter={() => setHoveredButton(hoverStyles.medium)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => handleDifficultyChange("MEDIUM")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                    style={buttonStyles(hoverStyles.medium)}
                                >
                                    MEDIUM
                                </button>
                                <button
                                    onMouseEnter={() => setHoveredButton(hoverStyles.easy)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={() => handleDifficultyChange("EASY")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                    style={buttonStyles(hoverStyles.easy)}
                                >
                                    EASY
                                </button>
                                <button
                                     onMouseLeave={() => setHoveredButton(null)}
                                     onClick={() => handleDifficultyChange("")}
                                     className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                >
                                    ALL
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative mx-2" style={{ zIndex: HIGH_Z_INDEX }}>
                        <button
                            onClick={() => setSolvedDropdownOpen(!solvedDropdownOpen)}
                            className="py-2 px-1 text-white text-xs font-medium rounded-md bg-blue-600 focus:outline-none"
                            style={{ backgroundColor: "#000930", width: "100px", whiteSpace: "nowrap" }}
                        >
                            {selectedSolved || "ALL"} ▼
                        </button>
                        {solvedDropdownOpen && (
                            <div className="absolute mt-2 w-100 bg-white rounded-lg shadow-lg" style={{ zIndex: HIGH_Z_INDEX }} ref={solvedRef}>
                                <button
                                    onClick={() => handleSolvedChange("SOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                >
                                    SOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("UNSOLVED")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
                                >
                                    UNSOLVED
                                </button>
                                <button
                                    onClick={() => handleSolvedChange("")}
                                    className="block w-full py-2 px-2 text-left transition duration-300 delay-100 text-sm"
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