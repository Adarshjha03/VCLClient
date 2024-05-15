import React, { useState } from 'react';
import avatar1 from './avatars/1.png';
import avatar2 from './avatars/2.png';
import avatar3 from './avatars/3.png';
import avatar4 from './avatars/4.png';
import avatar5 from './avatars/5.png';
import avatar6 from './avatars/6.png';
import avatar7 from './avatars/7.png';
import avatar8 from './avatars/8.png';
import avatar9 from './avatars/9.png';

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
];

const AvatarSelector = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const handleSubmit = async () => {
    if (selectedAvatar !== null) {
      
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({ avatar: selectedAvatar }),
      });

      if (response.ok) {
        console.log('Avatar selected successfully');
      } else {
        console.error('Error selecting avatar');
      }
    } else {
      console.error('No avatar selected');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="grid grid-cols-3 gap-4">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`w-24 h-24 rounded-full overflow-hidden cursor-pointer border-4 ${
              selectedAvatar === index + 1 ? 'border-blue-500 shadow-lg shadow-blue-500/50' : 'border-transparent'
            }`}
            onClick={() => setSelectedAvatar(index + 1)}
          >
            <img
              src={avatar}
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
    </div>
  );
};

export default AvatarSelector;
