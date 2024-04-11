import React from "react";

const ProfilePage = () => {
  // Updated user data
  const user = {
    name: "Gunjan Agrawal",
    email: "gunjanagrawal@example.com",
    dateOfBirth: "January 1, 1990",
    country: "India",
    joinedDate: "March 15, 2020",
    bio:
      "Passionate coder and lifelong learner. Love to explore new technologies.",
    // Add more user data as needed
  };

  // Sample statistics
  const statistics = [
    { label: "Total Labs Used", value: 20 },
    { label: "Active Hours Today", value: 3 },
    { label: "Current Lab", value: "Python Basics" },
    { label: "Suggested Lab", value: "Data Structures and Algorithms" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-8 flex-grow">
        <div className="flex items-center mb-8">
          <img
            src="https://cdn.pixabay.com/photo/2019/12/24/15/38/hacker-4717018_1280.png"
            alt="User"
            className="w-24 h-24 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="border-t border-gray-800 pt-4">
            <p className="font-bold">Date of Birth:</p>
            <p className="text-gray-400">{user.dateOfBirth}</p>
          </div>
          <div className="border-t border-gray-800 pt-4">
            <p className="font-bold">Country:</p>
            <p className="text-gray-400">{user.country}</p>
          </div>
          <div className="border-t border-gray-800 pt-4">
            <p className="font-bold">Joined Date:</p>
            <p className="text-gray-400">{user.joinedDate}</p>
          </div>
          <div className="col-span-2 border-t border-gray-800 pt-4">
            <p className="font-bold">Bio:</p>
            <p className="text-gray-400">{user.bio}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {statistics.map((statistic, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gray-800 hover:bg-yellow-500 hover:text-gray-900 transition duration-300"
            >
              <h3 className="text-lg font-semibold">{statistic.label}</h3>
              <p className="text-gray-400">{statistic.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
