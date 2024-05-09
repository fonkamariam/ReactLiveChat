import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword () {
  const [code, setCode] = useState('');
  const [password,setPassword]=useState('');
  const [rePassword, setRePassword]=useState('');
  const [goodMessage, setgoodMessage] = useState('');
  
  const [email, setEmailPara] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ForgotPassword');
  const navigate = useNavigate(); // Access the history object
  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
      setgoodMessage('');
    }, 2000); // Clear error message after 2 seconds (3000 milliseconds)
  };
  
  
  const handleEmailChange = (e) => {
    setEmailPara(e.target.value);
  }

  const handleSubmitForgot = (e) => {
    e.preventDefault();
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
        setActiveTab('V_ForgotPassword'); // Navigate to the verifySignU
        
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
  // For verify
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }
  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  }
  const handleSubmitVerifyPassword = (e) => {
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
        email: email, // Use the email from the authData context
        password: password,
        v_code:code
      })
    }) 
    .then(response => {
      if (response.ok) {
        console.log('OK,Updated');
        setgoodMessage('Successfully updated, Headback and login with your new password');
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

  //setIsLoading(false);
  return (
    <div className="container">
          
          <div className="content">
            {activeTab === 'ForgotPassword' && (
               <div className="container">
               <h2>Forgot Password </h2>
               <form onSubmit={handleSubmitForgot}>
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
               {goodMessage && <p style={{color: 'green'}}>{goodMessage}</p>}
          
               {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
               {isLoading && <p>Loading...</p>}
               
             </div>
         
            )}
            {activeTab === 'V_ForgotPassword' && ( 
              <div className="container">
              <h2>Verify Code</h2>
              <form onSubmit={handleSubmitVerifyPassword}>
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
              {goodMessage && <p style={{color: 'green'}}>{goodMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              
            </div>
            )}
          </div>
          <p>
          <br/><br/>
          <Link to="/">Login</Link>
         </p>
        </div>
      ); 
}
export default ForgotPassword;