import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";

function VerifySignUp() {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authData } = useAuth();
  const navigate = useNavigate(); // Access the history object

  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 2000); // Clear error message after 3 seconds (3000 milliseconds)
  };
  
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length < 5) {
      setErrorMessage('Incorrect Code');
      clearErrorMessageAfterDelay();
      return; 
    }
    setIsLoading(true); // Set loading state to true before making the API call
    
    fetch('http://localhost:5206/api/Users/registerTwo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        email: authData.email, // Use the email from the authData context
        password: authData.password, // Use the password from the authData context
        vertificationNo: code // Use the code entered by the user
      })
    }) 
    .then(response => {
      if (response.ok) {
        console.log('OK');
        return response.json();
      }else if (response.status === 10) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Incorrect Verification Number'); 
        clearErrorMessageAfterDelay();
      }else if (response.status === 20) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Verification Number Expired,Try again');
        clearErrorMessageAfterDelay();
        setTimeout(() => {
          navigate(`/signup`); // Redirect the user after displaying the error message
        }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
      } else {
        setIsLoading(false);
        setErrorMessage('Connection Problem. Please try again.');
        clearErrorMessageAfterDelay(); // Set error message for the user
        }
    }).then(data => {
      if (data) {
        sessionStorage.setItem('userId', data.id);
        sessionStorage.setItem('Token', data.token);
        sessionStorage.setItem('RefreshToken',data.refreshToken);
        console.log("Check local Storage");
  
        setIsLoading(false);
        // Handle successful response and set user data state
        navigate(`/insertProfile`);  
      }
      
    }).catch(error => {
      setIsLoading(false);
      setErrorMessage('Connection Problem. Fetch Error.');
      clearErrorMessageAfterDelay(); // Set error message for the user
    });
  }

  return (
    <div className="container">
      <h2>Verify Code</h2>
      <form onSubmit={handleSubmit}>
        <label>Verification Number</label>
        <input 
          type="Number" 
          required 
          value={code} 
          onChange={handleCodeChange} 
          disabled={isLoading}
        />
        <br/><br/>
        <button disabled={isLoading}>Enter</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>
        <Link to="/forgotpassword">Forgot Password?</Link>
        <br/><br/>
        <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default VerifySignUp;