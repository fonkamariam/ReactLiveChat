// LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function LoginPage() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Access the history object
  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 2000); // Clear error message after 2 seconds (3000 milliseconds)
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (e)=>{
    e.preventDefault();
    if (password.length < 5) {
      setErrorMessage('Invalid Password');
      clearErrorMessageAfterDelay();
      return; // Stop form submission if password is invalid
    }
    setIsLoading(true); // Set loading state to true before making the API call
    
    fetch('http://localhost:5206/api/Users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        email: email, // Use the email from the authData context
        password: password // Use the password from the authData context
      }) 
    }).then(response => {
      if (response.ok) {
        console.log('OK');
        return response.json(); 
      }else if (response.status === 10) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Email Invalid'); 
        clearErrorMessageAfterDelay();
      }else if (response.status === 20) {
        // Handle bad request
        
        setIsLoading(false);
        setErrorMessage('Wrong Password');
        clearErrorMessageAfterDelay();
        
      } else { 
        console.log("here");
        setIsLoading(false);
        setErrorMessage('Connection Problem. Please try again.'); 
        clearErrorMessageAfterDelay(); // Set error message for the user
      } 
    }).then(data => {
      if (data ) {
      console.log("there is data");  
      sessionStorage.setItem('userId', data.id);
      console.log(data.id);
      sessionStorage.setItem('Token', data.token); 
      sessionStorage.setItem('RefreshToken',data.refreshToken);
      sessionStorage.setItem('RefreshTokenExpiry',data.refreshTokenExpiry)
         // it is an Object
      setIsLoading(false); 
      // Handle successful response and set user data state
      navigate(`/chats`);
      }
      
    }).catch(error => {
      setIsLoading(false);
      setErrorMessage('Connection Problem. Fetch Error.');
      clearErrorMessageAfterDelay(); // Set error message for the user
    }); 
    
  
  }
  
  return (
    <div className="container">
      <h2>Login Page</h2> 
      <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input 
          type="email" 
          required 
          value={email} 
          onChange={handleEmailChange} 
          disabled={isLoading} // Disable input field while loading
        />
      <br></br><br></br>
      <label>Password</label>
        <input 
            type="current-password" 
            required 
            value={password} 
            onChange={handlePasswordChange} 
            disabled={isLoading} // Disable input field while loading
          />
      <br></br><br></br>
      <button disabled={isLoading}>Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isLoading && <p>Loading...</p>}
      <p>
      <Link to="/forgotpassword">Forgot Password?</Link>
      <br></br>
      <Link to="/signup">Sign Up</Link>
      
      </p>
    </div>
  );
}

export default LoginPage;
