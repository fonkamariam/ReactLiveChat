import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [activeTab, setActiveTab] = useState('SignUp');
  const [goodMessage, setgoodMessage] = useState('');
  
  const [email, setEmailPara] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password,setPassword]=useState('');
  const [rePassword, setRePassword]=useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  
  const navigate = useNavigate(); // Access the history object
  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 2000); // Clear error message after 2 seconds (3000 milliseconds)
  };
  
  
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  }

  const handleEmailChange = (e) => {
    setEmailPara(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  }

  const handleSubmitSignUp = (e) => {
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
        setActiveTab('V_SignUp')
        
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
        setErrorMessage('Connection Problem. Please try again.Backend');
        clearErrorMessageAfterDelay();
      } 
    })
    .catch(error => {
      setIsLoading(false);
      setErrorMessage('Connection Problem. Please try again.');
      clearErrorMessageAfterDelay(); // Set error message for the user
    })
  }
  const handleSubmitVSignUp = (e) => {
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
        email: email, // Use the email from the authData context
        password: password, // Use the password from the authData context
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
        setErrorMessage('Connection Problem. Please try again.Backend');
        clearErrorMessageAfterDelay(); // Set error message for the user
        }
    }).then(data => {
      if (data) {
        sessionStorage.clear();
        sessionStorage.setItem('userId', data.id);
        sessionStorage.setItem('Token', data.token);
        sessionStorage.setItem('RefreshToken',data.refreshToken);
        sessionStorage.setItem('RefreshTokenExpiry',data.refreshTokenExpiry)
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
      
      <div className="content">
        {activeTab === 'SignUp' && (
          <div className="container">
          <h2>Sign Up Page</h2>
          <form onSubmit={handleSubmitSignUp}>
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
          
        </div>
     
        )}
        {activeTab === 'V_SignUp' && ( 
          <div className="container">
          <h2>Verify Code</h2>
          <form onSubmit={handleSubmitVSignUp}>
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
        </div>
        )}
      </div>
      <p>
      {goodMessage && <p style={{color: 'green'}}>{goodMessage}</p>}
      <Link to="/forgotpassword">Forgot Password?</Link>
      <br/><br/>
      <Link to="/">Login</Link>
     </p>
    </div>
  ); 
}
export default SignUp;