import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [activeTab, setActiveTab] = useState('SignUp');
  const [goodMessage, setgoodMessage] = useState('');
  const[name,setName]=useState('');
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
  const handleNameChange =(e)=>{
    setName(e.target.value);
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
    fetch('https://livechatbackend-xwgx.onrender.com/api/Users/registerOne', {
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
        setgoodMessage("");
        setActiveTab('V_SignUp')
        
      } else if (response.status === 10) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Email already in use');
        clearErrorMessageAfterDelay();
      }else if (response.status === 20) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Could not Send Email, Try again later');
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
    fetch('https://livechatbackend-xwgx.onrender.com/api/Users/registerTwo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        name: name,
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
        sessionStorage.setItem('Name',data.name);
        console.log("Check local Storage");
  
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
  const backToSignUp = ()=>{
    setActiveTab('SignUp')
  }
 return (
      <div className="contentSignUp">
        {activeTab === 'SignUp' && (
          <div className="formContainer">
          <form className='formSignUp' onSubmit={handleSubmitSignUp}>
          <span className='logo'>Fonkagram</span>
          <span className='title'>Register</span>
            
          <input 
            className='emailInput'
              type="text" 
              placeholder='Name'
              required 
              value={name} 
              onChange={handleNameChange} 
              disabled={isLoading} // Disable input field while loading
            />
            
            <input 
            className='emailInput'
              type="email" 
              placeholder='Email'
              required 
              value={email} 
              onChange={handleEmailChange} 
              disabled={isLoading} // Disable input field while loading
            />
            <input 
            className='emailInput'
                type="current-password" 
                placeholder='Password'
                required 
                value={password} 
                onChange={handlePasswordChange} 
                disabled={isLoading} // Disable input field while loading
              />
            <input 
            className='emailInput'
                type="current-password" 
                placeholder='Re-Enter Password'
                required 
                value={rePassword} 
                onChange={handleRePasswordChange} 
                disabled={isLoading} // Disable input field while loading
            />
            <p>You have an account? </p>
            <button className='login'><Link to="/">Login</Link></button>
            <button className='buttonSignUp' disabled={isLoading}>Register</button>
          
          {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
          {goodMessage && <p className='goodMessage'>{goodMessage}</p>}
          {isLoading && <p className='isLoading'>Loading...</p>}
          </form>
          
        </div>
     
        )}
        {activeTab === 'V_SignUp' && ( 
          <div className="formContainer">
          <form className='formSignUp' onSubmit={handleSubmitVSignUp}>
          <span className='logo'>Fonkagram</span>
          <span className='title'>Enter verification number  </span>
            <input 
            className='emailInput'
            placeholder='Verification Number'
              type="Number" 
              required 
              value={code} 
              onChange={handleCodeChange} 
              disabled={isLoading}
            />
            
            
           <button className='buttonSignUp' onClick={backToSignUp}>Back to registration form</button>
            <button className='buttonSignUp' disabled={isLoading}>Enter</button>
          </form>
          {isLoading && <p className='isLoading'>Loading...</p>}
          {errorMessage && <p className='errorMessage' style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        )}
      </div>
     
  ); 
}
export default SignUp;