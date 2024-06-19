import React, { useState } from "react";

const YourComponent = () => {
  const [responseData, setResponseData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://3.109.152.183/req_vm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Add any request parameters if needed
        })
      });

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Request Virtual Machine</button>
      {responseData && (
        <div>
          <h2>Response:</h2>
          <p>{responseData.message}</p>
          <p>VM URL: <a href={responseData.vm_url} target="_blank">{responseData.vm_url}</a></p>
          <p>Password: {responseData.password}</p>
        </div>
      )}
    </div>
  );
};

export default YourComponent;
