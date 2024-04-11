exports.handler = async (event, context) => {
    const { httpMethod, headers, body } = event;
    const apiUrl = 'http://3.111.169.113/req_vm';
  
    try {
      const response = await fetch(apiUrl, {
        method: httpMethod,
        headers,
        body,
      });
  
      const data = await response.json();
  
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to proxy request' }),
      };
    }
  };