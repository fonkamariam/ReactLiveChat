// ForgotPasswordPage.js
import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function VerifyForgottenPassword() {
  const [code, setCode] = useState('');
  const [password,setPassword]=useState('');
  const [rePassword, setRePassword]=useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [goodMessage, setgoodMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authData,forgotPassword } = useAuth();
  const navigate = useNavigate(); // Access the history object

  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
      setgoodMessage('');
    }, 2000); // Clear error message after 3 seconds (3000 milliseconds)
  };
  
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length < 5) {
      setErrorMessage('Incorrect Code');
      clearErrorMessageAfterDelay();
      return; 
    }
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
    fetch('http://localhost:5206/api/Users/UpdatePasswordThroughCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        email: forgotPassword.email, // Use the email from the authData context
        password: password,
        v_code:code
      })
    }) 
    .then(response => {
      if (response.ok) {
        console.log('OK,Updated');
        setgoodMessage('Successfully updated, Headback and login');
        clearErrorMessageAfterDelay();  
        setTimeout(() => {
          navigate(`/`); // Redirect the user after displaying the error message
        }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
      }else if (response.status === 10) { 
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Invalid Email or Expired'); 
        clearErrorMessageAfterDelay();
        setTimeout(() => {
          navigate(`/forgotpassword`); // Redirect the user after displaying the error message
        }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
      }else if (response.status === 20) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Invalid Number or Verification Number Expired,Try again');
        clearErrorMessageAfterDelay(); // Set error message for the user
        setTimeout(() => {
          navigate(`/forgotpassword`); // Redirect the user after displaying the error message
        }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
      } else {
        setIsLoading(false);
        setErrorMessage('Connection Problem. Please try again.');
        clearErrorMessageAfterDelay(); // Set error message for the user
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
        <label>New Password</label>
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
        <button disabled={isLoading} >Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {goodMessage && <p>{goodMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>
        <Link to="/forgotpassword">Forgot Password?</Link>
        <br/><br/>
        <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default VerifyForgottenPassword;