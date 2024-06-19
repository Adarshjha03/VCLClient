// userService.js
const backendUrl = "https://api.virtualcyberlabs.com";

export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("Token");
    const userResponse = await fetch(`${backendUrl}/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await userResponse.json();
    return userData.admin;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return false;
  }
};
