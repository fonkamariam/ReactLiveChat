import React, { useState ,useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';


function Chats() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Access the history object
  
  useEffect(() => {
    // Fetch user data from API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5206/api/UserProfile/GetOwnUserProfile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data); // Update user data state
          sessionStorage.setItem('firstName', data.name);
          sessionStorage.setItem('lastName', data.lastName);
          sessionStorage.setItem('bio',data.bio);
      
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error
      }
    };
    fetchData(); // Call fetchData function when component mounts
  }, []);
  // do sth
  
  const handleLogOut = (e) =>{
    sessionStorage.clear();
    console.log("Session Storage cleared");
    navigate(`/`);
 }
 
  return (
    <div className="container">
      <h2>Logged In</h2>
      {userData ? ( // Render HTML element only when userData is available
        <div>
          Welcome your: {userData.name} {userData.lastName} <br />
          Bio: {userData.bio} 
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <p>
        <button onClick={handleLogOut}>Logout</button>
      </p>
      <p>
        <br></br>
        <Link to="/settings">Setting</Link>
        
        <br/><br/>
      </p>
    </div>
  );
}
export default Chats;