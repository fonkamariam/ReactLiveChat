import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function SignUpPage() {
  const [email, setEmailPara] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password,setPassword]=useState('');
  const [rePassword, setRePassword]=useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authData, setAuthData } = useAuth();
  const navigate = useNavigate(); // Access the history object
  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 2000); // Clear error message after 2 seconds (3000 milliseconds)
  };
  
  
  const handleEmailChange = (e) => {
    setEmailPara(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 5) {
      setErrorMessage('Password must be at least 5 characters long.');
      clearErrorMessageAfterDelay();
      return; // Stop form submission if password is invalid
    }
    if (password !== rePassword) {
      setErrorMessage("Password Doesn't Match");
      clearErrorMessageAfterDelay();
      return;
    }
    setIsLoading(true); // Set loading state to true before making the API call
    fetch('http://localhost:5206/api/Users/registerOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(email)
    })
    .then(response => {
      if (response.ok) {
        setIsLoading(false);
        console.log(`Verification Sent to ${email}`);
        
        setAuthData({ email, password }); // Store email and password in context
        
        navigate('/verifySignUp'); // Navigate to the verifySignU
        
      } else if (response.status === 10) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Email already in use');
        clearErrorMessageAfterDelay();
      }else if (response.status === 20) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Couldnt Send Email,check if email is valid and try again');
        clearErrorMessageAfterDelay();
      } else {
        // Handle other errors
        setIsLoading(false);
        setErrorMessage('Connection Problem. Please try again.');
        clearErrorMessageAfterDelay();
      } 
    })
    .catch(error => {
      setIsLoading(false);
      setErrorMessage('Connection Problem. Please try again.');
      clearErrorMessageAfterDelay(); // Set error message for the user
    })
  }
  //setIsLoading(false);
  return (
    <div className="container">
      <h2>Sign Up Page</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input 
          type="email" 
          required 
          value={email} 
          onChange={handleEmailChange} 
          disabled={isLoading} // Disable input field while loading
        />
        <label>Password</label>
        <input 
            type="current-password" 
            required 
            value={password} 
            onChange={handlePasswordChange} 
            disabled={isLoading} // Disable input field while loading
          />
        <label>ReEnter Password</label>
        <input 
            type="current-password" 
            required 
            value={rePassword} 
            onChange={handleRePasswordChange} 
            disabled={isLoading} // Disable input field while loading
        />
        
        <br/><br/>
        <button disabled={isLoading}>Register</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isLoading && <p>Loading...</p>}
      <p>
        <Link to="/forgotpassword">Forgot Password?</Link>
        <br/><br/>
        <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default SignUpPage;
