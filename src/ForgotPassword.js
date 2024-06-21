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
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400">
        <div className="bg-white p-10 rounded-lg flex flex-col items-center gap-4">
            {activeTab === 'ForgotPassword' && (
              <form className="w-full flex flex-col items-center gap-4" onSubmit={handleSubmitForgot}>
                <span className="text-black font-bold text-2xl">Fonkagram</span>
                <input
                  className="w-full p-4 border-b border-blue-400 focus:outline-none"
                  placeholder="Email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                />
                <button className="w-full bg-blue-400 text-black font-bold py-2 mt-4" disabled={isLoading}>
                  Submit
                </button>
                <p className="text-black font-bold mt-4">
                  <Link to="/">Back to login page</Link>
                </p>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {goodMessage && <p className="text-green-500">{goodMessage}</p>}
                {isLoading && <p className="text-blue-500">Loading...</p>}
              </form>
            )}
            
            {activeTab === 'V_ForgotPassword' && (
              <div className="flex items-center justify-center min-h-screen bg-blue-400">
                <div className="bg-white p-10 rounded-lg flex flex-col items-center gap-4">
                  <form className="w-full flex flex-col items-center gap-4" onSubmit={handleSubmitVerifyPassword}>
                    <span className="text-black font-bold text-2xl">Fonkagram</span>
                    <span className="text-blue-900 text-lg font-bold">Register</span>
                    <input
                      className="w-full p-4 border-b border-blue-400 focus:outline-none"
                      placeholder="Verification Number"
                      type="number"
                      required
                      value={code}
                      onChange={handleCodeChange}
                      disabled={isLoading}
                    />
                    <input
                      className="w-full p-4 border-b border-blue-400 focus:outline-none"
                      placeholder="New Password"
                      type="password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      disabled={isLoading}
                    />
                    <input
                      className="w-full p-4 border-b border-blue-400 focus:outline-none"
                      placeholder="Re-enter Password"
                      type="password"
                      required
                      value={rePassword}
                      onChange={handleRePasswordChange}
                      disabled={isLoading}
                    />
                    <button className="w-full bg-blue-400 text-black font-bold py-2 mt-4" disabled={isLoading}>
                      Submit
                    </button>
                    <p className="text-black font-bold mt-4">
                      <Link to="/">Back to login page</Link>
                    </p>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {goodMessage && <p className="text-green-500">{goodMessage}</p>}
                    {isLoading && <p className="text-blue-500">Loading...</p>}
                  </form>
                </div>
              </div>
            )}
          </div>
          
        </div>
      ); 
}
export default ForgotPassword;