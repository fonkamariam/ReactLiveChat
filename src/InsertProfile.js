// ForgotPasswordPage.js
import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function InsertProfile() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  
  // here
  //const [code, setCode] = useState('');
  //const [password,setPassword]=useState('');
  //const [rePassword, setRePassword]=useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [goodMessage, setgoodMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //const { authData,forgotPassword } = useAuth();
  const navigate = useNavigate(); // Access the history object

  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
      setgoodMessage('');
    }, 2000); // Clear error message after 3 seconds (3000 milliseconds)
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  }
  const handleLastNameChange = (e) => {
    setLastName(e.target.value); 
  }
  const handleBioChange = (e) => {
    setBio(e.target.value); 
  }
  
  //here
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setIsLoading(true); // Set loading state to true before making the API call
    fetch('http://localhost:5206/api/UserProfile/UpdatUserProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }, 
      body: JSON.stringify({
        name: firstName,
        bio: bio,
        lastName: lastName
      })
    }) 
    .then(response => {
      if (response.ok) {
        console.log('OK,Updated');
        setgoodMessage('Successfully Updated');  
        clearErrorMessageAfterDelay();  
        setTimeout(() => {
          navigate(`/editProfile`); // Redirect the user after displaying the error message
        }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
      }else if (response.status === 15) { 
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Token Expired'); 
        clearErrorMessageAfterDelay(); 
        setTimeout(() => {
          navigate(`/`); // Redirect the user after displaying the error message
        }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
      }else if (response.status === 10) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Internal Server Error,Try again');
        clearErrorMessageAfterDelay(); // Set error message for the user
        
      }else if( response.status === 401){
        setIsLoading(false);
        setErrorMessage('Invalid token');
        clearErrorMessageAfterDelay(); // Set error message for the user
        
      }else if( response.status === 30){
        setIsLoading(false);
        setErrorMessage('DataBase connection problem');
        clearErrorMessageAfterDelay(); // Set error message for the user
        
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
      <h2>Create Profile Information</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <br/><br/>
        <input 
          type="text" 
          required 
          value={firstName} 
          onChange={handleFirstNameChange} 
          disabled={isLoading}
        />
        <br/><br/>
        <label>Last Name</label>
        <br/><br/>
        
        <input 
          type="text"  
          value={lastName} 
          onChange={handleLastNameChange} 
          disabled={isLoading}
        />
        <br/><br/>
        
        <label>Bio (Any details such as age Occupation or City.)</label>
        <br/><br/>
        <input 
          type="text"  
          value={bio} 
          onChange={handleBioChange} 
          disabled={isLoading}
        />
        <br/><br/>

        <button disabled={isLoading} >Set</button>
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
export default InsertProfile;
