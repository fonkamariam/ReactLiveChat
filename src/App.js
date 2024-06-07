import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './LoginPage';
import Chats from "./Chats"
import InsertProfile from './InsertProfile';
import Settings from './Settings';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import './Beauty.css';

function App() {
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      
      if (sessionStorage.getItem('RefreshToken') && sessionStorage.getItem('Token')) {
          
      fetch('http://localhost:5206/api/Users/refreshToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }, 
      body: JSON.stringify({
        id : sessionStorage.getItem('userId'),
        token: sessionStorage.getItem('RefreshToken')
      }
    ) 
    }).then(response => {
      if (response.ok) {
        console.log('Got Refresh Token');
        return response.json();
      }else if (response.status === 10) {
        // Handle bad request
        //setIsLoading(false);
        //setErrorMessage('Invalid Id'); 
        //clearErrorMessageAfterDelay();
        console.log("Invalid Id");
      }else if (response.status === 20) {
        // Handle bad request
        
        //setIsLoading(false);
        //setErrorMessage('Invalid Refresh Token');
        //clearErrorMessageAfterDelay();
        console.log("Invalid Refresh Token");
        
      }else if(response.status === 30){
        //setIsLoading(false);
        //setErrorMessage('Refresh Token has Expired');
        //clearErrorMessageAfterDelay();
        console.log("Refresh Token Expired");
        
      }else { 
        //setIsLoading(false);
        //setErrorMessage('Connection Problem. Please try again.'); 
        //clearErrorMessageAfterDelay(); // Set error message for the user
        console.log("Connection Problem, Backend");
        
      } 
    }).then(data => {
      if (data ) {
        
      sessionStorage.setItem('Token', data.token);
      console.log("New Token");
      }
      
    }).catch(error => {
      //setIsLoading(false);
      //setErrorMessage('Connection Problem. Fetch Error.');
      //clearErrorMessageAfterDelay(); // Set error message for the user
      console.log("Connection Problem, Fetch error");
        
    }); 
      }
    }, 29*60*1000 ); // Run every 29 minutes

    // Cleanup function to clear the interval when the component unmounts or re-renders
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only after the initial render

  return (
    
    <Router>
      <div>
       
        <Routes>
          <Route path='/settings' element={<Settings />} />
          <Route path= "/insertProfile" element={<InsertProfile />} />
          <Route path= "/chats" element={<Chats />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
