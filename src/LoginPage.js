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
    fetch('https://livechatbackend-xwgx.onrender.com/api/Users/login', {
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
        return response.json(); 
      }else if (response.status === 400) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Email Invalid'); 
        clearErrorMessageAfterDelay();
      }else if (response.status === 401) {
        // Handle bad request
        
        setIsLoading(false);
        setErrorMessage('Wrong Password');
        clearErrorMessageAfterDelay();
        
      } else { 
        setIsLoading(false);
        setErrorMessage('Connection Problem. Please try again.'); 
        clearErrorMessageAfterDelay(); // Set error message for the user
      } 
    }).then(data => {
      if (data ) {
      sessionStorage.setItem('userId', data.id);
      sessionStorage.setItem('Token', data.token); 
      sessionStorage.setItem('RefreshToken',data.refreshToken);
      sessionStorage.setItem('RefreshTokenExpiry',data.refreshTokenExpiry)
      sessionStorage.setItem('Name',data.name);
      if (data.lastName !== null){ sessionStorage.setItem('LastName',data.lastName);
    }else {sessionStorage.setItem('LastName','');
  }
      if(data.bio!==null){sessionStorage.setItem('Bio',data.bio );
    }else{sessionStorage.setItem('Bio','' );
    }
      sessionStorage.setItem('Dark',data.dark);
      if(data.profilePicture !== null){
        sessionStorage.setItem('ProfilePic', JSON.stringify(data.profilePicture));  
      }else{
        sessionStorage.setItem('ProfilePic', JSON.stringify([]));
      
      }
      
      // it is an Object
      setIsLoading(false); 
      // Handle successful response and set user data state
      navigate(`/chats`);
      }
      
    }).catch(error => {
      setIsLoading(false);
      setErrorMessage('Connection Problem.');
      clearErrorMessageAfterDelay(); // Set error message for the user
    }); 
    
  
  }
  
  return (
    <div className="formContainer">
  
      <form className='formSignUp' onSubmit={handleSubmit}>
      <span className='logo'>Fonkagram</span>
      <span className='title'>Login</span>
      <input 
          placeholder='Email'
          className='emailInput'
          type="email" 
          required 
          value={email} 
          onChange={handleEmailChange} 
          disabled={isLoading} // Disable input field while loading
        />
           
        <input 
            placeholder='Password'
            className='emailInput'
            type="Password" 
            required 
            value={password} 
            onChange={handlePasswordChange} 
            disabled={isLoading} // Disable input field while loading
          />
       <button className='buttonSignUp' disabled={isLoading}>Login</button>

      <p>You don't have an account?</p>
      <button className='login'> <Link to="/SignUp">Register</Link></button>

      <p className='login'><Link to="/forgotpassword">ForgotPassword</Link></p>
        
          
      {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
      {isLoading && <p className='isLoading'>Loading...</p>}
          
      </form>
      </div>
  );
}

export default LoginPage;
