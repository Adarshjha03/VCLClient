import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar1';
import googlelogo from './Google-Analytics-Logo.png';
import openai from './OpenAiLogo.png';

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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('Token');
      try {
        const response = await fetch(`${backendUrl}/site_builder`, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setGoogleAnalyticsCode(data.google_analytics_key||"");
          setOpenAiIntegration(data.need_ai || false);
          setOpenAiKey(data.open_ai_key || '');
        } else {
          setError('Failed to fetch data from the backend');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while fetching data from the backend');
      }
    };

    fetchData();
  }, [backendUrl]);

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem('selectedTopic', topicId);
    navigate('/home');
  };

  const handleGoogleAnalyticsSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    const payload = { google_analytics_key: googleAnalyticsCode };

    try {
      const response = await fetch(`${backendUrl}/site_builder`, {
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
    const payload = {
      need_ai: openAiIntegration,
      open_ai_key: openAiIntegration ? openAiKey : '',
    };

    try {
      const response = await fetch(`${backendUrl}/site_builder`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('OpenAI settings saved successfully!');
      } else {
        alert('Failed to save OpenAI settings');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving OpenAI settings');
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
              <label className="block text-lg font-semibold text-gray-700">Google Analytics</label>
              <img src={googlelogo} alt="Google Analytics Logo" className="m-2 ml-4 h-20 w-22" />
            </div>
            <div className="flex-1">
              <textarea
                id="googleAnalyticsCode"
                value={googleAnalyticsCode || ''}
                onChange={(e) => setGoogleAnalyticsCode(e.target.value)}
                rows="5"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Google Analytics code here"
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
              <img src={openai} alt="OpenAI Logo" className="mt-10 h-10 w-23" />
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
                    value={openAiKey || ''}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    rows="5"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your OpenAI key here"
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
              {!openAiIntegration && (
                <button
                  type="submit"
                  className="mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              )}
            </div>
          </form>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="mt-10 p-4 bg-white border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Steps to integrate Google Analytics:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Sign in to Google Analytics:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Go to the <a href="https://analytics.google.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics website</a>.</li>
                  <li>Sign in with your Google account. If you don’t have an account, you will need to create one.</li>
                </ul>
              </li>
              <li><strong>Set up a Property:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Once logged in, you will see the Admin panel in the bottom left corner.</li>
                  <li>In the “Account” column, make sure your account is selected.</li>
                  <li>In the “Property” column, click on “+ Create Property.”</li>
                  <li>Follow the prompts to set up your property (your website). This will include entering your website’s name, URL, and other details.</li>
                </ul>
              </li>
              <li><strong>Get the Tracking ID:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>After setting up your property, you will be directed to the Property settings.</li>
                  <li>In the Property column, click on “Tracking Info” and then “Tracking Code.”</li>
                  <li>Here you will find your “Tracking ID” (it starts with “UA-” followed by numbers).</li>
                </ul>
              </li>
              <li><strong>Copy the Tracking ID:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>Copy the Tracking ID provided in this section. This ID is what you'll use to link your website to Google Analytics.</li>
                </ul>
              </li>
            </ol>
            <p className="mt-4">By following these steps, you'll be able to obtain the Google Analytics tracking code for your website. Just use the Tracking ID in your website’s configuration to start tracking your site's traffic.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Integration;
