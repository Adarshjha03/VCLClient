import React, { useState } from 'react';

const avatars = [
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/1.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/2.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/3.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/4.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/5.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/6.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/7.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/8.png',
  'https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/9.png',
];

const AvatarSelector = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null); // State variable for response message
  const backendUrl = "https://api.virtualcyberlabs.com";
  
  const handleSubmit = async () => {
    if (selectedAvatar !== null) {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });

      if (response.ok) {
        setResponseMessage('Avatar selected successfully'); // Set success message
      } else {
        setResponseMessage('Error selecting avatar'); // Set error message
      }
    } else {
      setResponseMessage('No avatar selected'); // Set error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        {avatars.map((avatarUrl, index) => (
          <div
            key={index}
            className={`w-24 h-24 rounded-full overflow-hidden cursor-pointer border-4 ${
              selectedAvatar === index + 1 ? 'border-blue-500 shadow-lg shadow-blue-500/50' : 'border-transparent'
            }`}
            onClick={() => setSelectedAvatar(index + 1)}
          >
            <img
              src={avatarUrl}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {/* Conditionally render response message */}
      {responseMessage && (
        <div className={`bg-${responseMessage.includes('success') ? 'green' : 'red'}-100 border border-${responseMessage.includes('success') ? 'green' : 'red'}-400 text-${responseMessage.includes('success') ? 'green' : 'red'}-700 px-4 py-3 rounded mt-4`} role="alert">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;
