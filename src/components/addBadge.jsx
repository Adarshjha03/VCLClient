import React, { useState, useEffect } from 'react';

const AddBadge = ({ }) => {
    const [badgeName, setBadgeName] = useState('');
    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [badgeNameError, setBadgeNameError] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const backendUrl = "https://api.virtualcyberlabs.com";
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const token = localStorage.getItem("Token");
                const response = await fetch(`${backendUrl}/topic`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch topics.");
                }

                const data = await response.json();
                setTopics(data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();
    }, [backendUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                if (img.width > 500 || img.height > 500) {
                    setImageError('Image size should be 500x500 pixels or less.');
                    setImage(null);
                } else {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImage(reader.result);
                        setImageError('');
                    };
                    reader.readAsDataURL(file);
                }
            };
            img.onerror = () => {
                setImageError('Invalid image file.');
                setImage(null);
            };
            img.src = URL.createObjectURL(file);
        }
    };

    const validateBadgeName = (name) => {
        if (name.split(' ').length > 3) {
            setBadgeNameError('Badge name should be less than 4 words.');
            return false;
        }
        setBadgeNameError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateBadgeName(badgeName)) return;
    
        try {
            const token = localStorage.getItem("Token");
            const encodedImage = image.split(',')[1]; // Get the base64 encoded string without the prefix
    
            const response = await fetch(`${backendUrl}/topic_badge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    badgeName: badgeName,
                    badge: encodedImage, // Send only the encoded string
                    topic_id: selectedTopic,
                }),
            });
    
            if (response.ok) {
                setResponseMessage('Badge added successfully');
            } else {
                setResponseMessage('Error adding badge');
            }
        } catch (error) {
            console.error("Error adding badge:", error);
            setResponseMessage('Error adding badge');
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Add New Badge</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Badge Name (less than 4 words)
                    </label>
                    <input
                        type="text"
                        value={badgeName}
                        onChange={(e) => setBadgeName(e.target.value)}
                        onBlur={() => validateBadgeName(badgeName)}
                        className="p-2 border rounded w-full"
                        required
                    />
                    {badgeNameError && (
                        <p className="text-red-500 text-xs mt-2">{badgeNameError}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image (500x500 pixels or less)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-2 border rounded w-full"
                        required
                    />
                    {imageError && (
                        <p className="text-red-500 text-xs mt-2">{imageError}</p>
                    )}
                </div>
                {image && (
                    <div className="mb-4">
                        <img src={image} alt="Badge Preview" className="w-24 h-24 object-cover rounded-full" />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Topic
                    </label>
                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="p-2 border rounded w-full"
                        required
                    >
                        <option value="">Select a topic</option>
                        {topics.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Badge
                </button>
            </form>
            {responseMessage && (
                <div className={`bg-${responseMessage.includes('success') ? 'green' : 'red'}-100 border border-${responseMessage.includes('success') ? 'green' : 'red'}-400 text-${responseMessage.includes('success') ? 'green' : 'red'}-700 px-4 py-3 rounded mt-4`} role="alert">
                    {responseMessage}
                </div>
            )}
        </div>
    );
};

export default AddBadge;
