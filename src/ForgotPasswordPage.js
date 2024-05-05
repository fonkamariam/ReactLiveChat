// ForgotPasswordPage.js
import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ForgotPasswordPage() {
  const [email, setEmailPara] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authData, setAuthData, forgotPassword,setForgotPassword } = useAuth();
  const navigate = useNavigate(); // Access the history object
  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 2000); // Clear error message after 2 seconds (3000 milliseconds)
  };
  
  
  const handleEmailChange = (e) => {
    setEmailPara(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
    setIsLoading(true); // Set loading state to true before making the API call
    fetch('http://localhost:5206/api/Users/ForgotPassword', {
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
        setForgotPassword({ email }); // Store email and password in context
        navigate('/verifyForgottenPassword'); // Navigate to the verifySignU
        
      } else if (response.status === 10) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Invalid Email');
        clearErrorMessageAfterDelay();
      }else if (response.status === 20) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Couldnt Send Email,check if email is valid and try again');
        clearErrorMessageAfterDelay();
      } else if (response.status ===30) {
        // Handle other errors
        setIsLoading(false);
        setErrorMessage('Connection Problem. Please try again.');
        clearErrorMessageAfterDelay();
      }else{
        console.log(response.json());
        setIsLoading(false);
        setErrorMessage('I dont what problem it is, check Backend');
        clearErrorMessageAfterDelay();
      } 
    })
    .catch(error => {
      setIsLoading(false);
      setErrorMessage('Connection Problem Fetch. Please try again.');
      clearErrorMessageAfterDelay(); // Set error message for the user
    })
  }
  //setIsLoading(false);
  return (
    <div className="container">
      <h2>Forgot Password </h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input 
          type="email" 
          required 
          value={email} 
          onChange={handleEmailChange} 
          disabled={isLoading} // Disable input field while loading
        /> 
        <br/><br/>
        <button disabled={isLoading}>Submit</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {isLoading && <p>Loading...</p>}
      <p>
        <br/><br/>
        <Link to="/">Login</Link>
      </p>
    </div>
  );
}
export default ForgotPasswordPage;