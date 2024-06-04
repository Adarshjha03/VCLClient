import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar1';

function AdminPanel() {
  const [showMenu, setShowMenu] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [favicon, setFavicon] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem('selectedTopic');
    return storedTopic ? parseInt(storedTopic) : 0;
  });

  const backendUrl = 'https://api.virtualcyberlabs.com';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        // Fetch site name
        const siteNameResponse = await fetch(`${backendUrl}/site_builder`);
        if (!siteNameResponse.ok) {
          throw new Error('Failed to fetch site name');
        }
        const siteNameData = await siteNameResponse.json();
        setSiteName(siteNameData.title);

        // Construct URLs for favicon and logo
        const baseUrl = window.location.origin.includes("http://") 
          ? window.location.origin.slice(7) 
          : window.location.origin;
        const faviconUrl = `https://cyber-range-assets.s3.ap-south-1.amazonaws.com/assets/${baseUrl}/favicon.ico`;
        const logoUrl = `https://cyber-range-assets.s3.ap-south-1.amazonaws.com/assets/${baseUrl}/logo.png`;

        // Fetch favicon
        setFaviconPreview(faviconUrl);

        // Fetch logo
        setLogoPreview(logoUrl);
      } catch (error) {
        console.error('Error fetching site data:', error);
      }
    };

    fetchSiteData();
  }, []);

  const handleFileChange = (e, setter, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        if (file.size / 1024 / 1024 > 1) {
          setError('File size should be less than 1MB');
        } else if (img.width > 512 || img.height > 512) {
          setError('Image dimensions should be less than or equal to 512x512');
        } else {
          setter(file);
          setPreview(URL.createObjectURL(file));
          setError('');
        }
      };
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSiteNameSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    const payload = { title: siteName };

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
        alert('Site name updated successfully!');
      } else {
        alert('Failed to update site name');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating site name');
    }
  };

  const handleFaviconSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    if (favicon) {
      const temp=await convertToBase64(favicon);
      const faviconBase64 = temp.split(',')[1];
      const payload = { faviconbase64: faviconBase64 };

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
          alert('Favicon updated successfully!');
        } else {
          alert('Failed to update favicon');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating favicon');
      }
    } else {
      setError('Please select a favicon to upload.');
    }
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Token');
    if (logo) {
      const temp = await convertToBase64(logo);
       const logoBase64=temp.split(',')[1];
      const payload = { logobase64: logoBase64 };

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
          alert('Logo updated successfully!');
        } else {
          alert('Failed to update logo');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating logo');
      }
    } else {
      setError('Please select a logo to upload.');
    }
  };
  
  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem('selectedTopic', topicId);
    navigate('/home');
  };
  
  return (
    <div className="flex h-screen font-sans bg-gray-200">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 bg-gray-100 overflow-y-auto">
        <Navbar style={{ position: 'fixed', width: '100%', zIndex: 1000 }} />
        <div className="p-6 mt-16">
          <h2 className="text-2xl font-bold mb-6">Site Builder</h2>
  
          <form onSubmit={handleSiteNameSubmit} className="mb-6 p-4 bg-white border rounded-lg flex">
            <div className="flex-1 pr-4">
              <label htmlFor="siteName" className="block text-lg font-semibold text-gray-700">Site Name</label>
              <p className="text-xs text-gray-500">Max length: 50 characters</p>
            </div>
            <div className="flex-1 flex items-center">
              <input
                type="text"
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
              <button
                type="submit"
                className="ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update
              </button>
            </div>
          </form>
  
          <form onSubmit={handleFaviconSubmit} className="mb-6 p-4 bg-white border rounded-lg flex">
            <div className="flex-1 pr-4">
              <label htmlFor="favicon" className="block text-lg font-semibold text-gray-700">Site Favicon</label>
              <p className="text-xs text-gray-500">Max size: 1MB, Max dimensions: 512x512px</p>
            </div>
            <div className="flex-1">
              {faviconPreview && <img src={faviconPreview} alt="Favicon Preview" className="mb-2 h-10" />}
              <div className="flex items-center">
                <input
                  type="file"
                  id="favicon"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFavicon, setFaviconPreview)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <button
                  type="submit"
                  className=" ml-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload
                </button>
              </div>
            </div>
          </form>
  
          <form onSubmit={handleLogoSubmit} className="p-4 bg-white border rounded-lg flex">
            <div className="flex-1 pr-4">
              <label htmlFor="logo" className="block text-lg font-semibold text-gray-700">Site Logo</label>
              <p className="text-xs text-gray-500">Max size: 1MB, Max dimensions: 512x512px</p>
            </div>
            <div className="flex-1">
              {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mb-2 h-20" />}
              <div className="flex items-center">
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setLogo, setLogoPreview)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <button
                  type="submit"
                  className="  ml-4  py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload
                </button>
              </div>
            </div>
          </form>
  
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  );
  }
  
  export default AdminPanel;
  