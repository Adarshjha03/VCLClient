import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar1';

function Integration() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem('selectedTopic');
    return storedTopic ? parseInt(storedTopic) : 0;
  });

  const [googleAnalyticsCode, setGoogleAnalyticsCode] = useState('');
  const [openAiIntegration, setOpenAiIntegration] = useState(false);
  const [openAiKey, setOpenAiKey] = useState('');
  const [error, setError] = useState('');

  const backendUrl = 'https://api.virtualcyberlabs.com';
  const navigate = useNavigate();

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem('selectedTopic', topicId);
    navigate('/home');
  };

  const handleGoogleAnalyticsSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    const payload = { googleAnalyticsCode };

    try {
      const response = await fetch(`${backendUrl}/integration/google_analytics`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Google Analytics code saved successfully!');
      } else {
        alert('Failed to save Google Analytics code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving Google Analytics code');
    }
  };

  const handleOpenAiSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    const payload = { openAiKey };

    try {
      const response = await fetch(`${backendUrl}/integration/open_ai`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('OpenAI key saved successfully!');
      } else {
        alert('Failed to save OpenAI key');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving OpenAI key');
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gray-200">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <Navbar style={{ position: 'fixed', width: '100%', zIndex: 1000 }} />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">SITE INTEGRATION</h2>

          <form onSubmit={handleGoogleAnalyticsSubmit} className="mb-6 p-4 bg-white border rounded-lg flex">
            <div className="flex-1 pr-4">
              <label className="block text-lg font-semibold text-gray-700">Google</label>
            </div>
            <div className="flex-1">
              <textarea
                id="googleAnalyticsCode"
                value={googleAnalyticsCode}
                onChange={(e) => setGoogleAnalyticsCode(e.target.value)}
                rows="5"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              ></textarea>
              <button
                type="submit"
                className="mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </form>

          <form onSubmit={handleOpenAiSubmit} className="p-4 bg-white border rounded-lg flex">
            <div className="flex-1 pr-4">
              <label className="block text-lg font-semibold text-gray-700">OpenAI</label>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <label htmlFor="openAiIntegration" className="block text-sm font-medium text-gray-700 mr-2">Enable OpenAI Integration</label>
                <input
                  type="checkbox"
                  id="openAiIntegration"
                  checked={openAiIntegration}
                  onChange={(e) => setOpenAiIntegration(e.target.checked)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              {openAiIntegration && (
                <div>
                  <textarea
                    id="openAiKey"
                    value={openAiKey}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    rows="5"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </form>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Integration;
