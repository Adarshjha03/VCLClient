import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import comingSoonGIF from './assets/comingSoon.gif'; // Import the GIF file
import dlogo from './assets/dlogo.png'; // Import the dlogo.png image

function Temp() {
  return (
    <div style={{ position: 'relative', height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img src={dlogo} alt="D Logo" style={{ width: '120px', marginBottom: '20px' }} /> {/* Display the dlogo.png image */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <img src={comingSoonGIF} alt="Coming Soon GIF" style={{ width: '80%', maxWidth: '600px', marginBottom: '20px' }} /> {/* Display the imported GIF */}
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Coming Soon</h1>
        <Link to="/Home" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#2b6cb0', padding: '10px 20px', borderRadius: '5px', fontSize: '16px' }}>Go Back</Link> {/* Link to Home page */}
      </div>
    </div>
  );
}

export default Temp;
