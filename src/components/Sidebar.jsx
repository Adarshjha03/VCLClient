import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import headlogo from '../assets/dlogo.png';
import logo from '../assets/bullet.png'
import plusLogo from '../assets/add.png';

const Sidebar = ({ showMenu, onTopicSelect, activeTopic }) => {
  const [topicsWithLogos, setTopicsWithLogos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false); // Initially assuming the user is not an admin

    useEffect(() => {
        const fetchUserData = async () => {
            try {const token = localStorage.getItem("Token");
                const userResponse = await fetch('http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/user', {
                    headers: {
                      Authorization: `Token ${token}`,
                    },
                });
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await userResponse.json();
                setAdmin(userData.admin); // Update the admin state based on the response
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData(); 
    }, []); 

  useEffect(() => {
    const fetchTopics = async () => {
      try {const token = localStorage.getItem("Token");
        const response = await fetch('http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/topic', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data = await response.json();
        const allProblemsTopic = { "id": 0 , "name": 'All Problems' };
        const updatedTopics = [allProblemsTopic, ...data];
        console.log(updatedTopics);
        setTopicsWithLogos(updatedTopics);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className={`w-1/5 h-full overflow-y-auto border-r bg-gray-100 sm:block ${showMenu ? 'block' : 'hidden'}`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#a5a5a5 #f3f4f6',
      }}
    >
      <div className="p-4">
        <img src={headlogo} alt="HeadLogo" className="w-full mb-4 " />
        <div className="space-y-4">
          {topicsWithLogos.map((topic) => (
            <div
            key={topic.id}
            className={`p-2 rounded-md font-medium text-sm flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300 ${
              activeTopic === topic.id ? 'bg-[#2234ae] text-white' : ''
            }`}
            onClick={() => onTopicSelect(topic.id === 0 ? 0 : topic.id)}
          >
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-4 h-4 mr-2" />
                {topic.name}
              </div>
            </div>
          ))}
          {admin && (
            <div className="p-2 rounded-md font-medium text-sm flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300">
              <Link to="/addTopic" className="flex items-center">
                <img src={plusLogo} alt="Logo" className="w-4 h-4 mr-2" />
                Add Topic
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
