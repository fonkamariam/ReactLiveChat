import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [firstName, setFirstName] = useState(sessionStorage.getItem('firstName'));
  const [lastName, setLastName] = useState(sessionStorage.getItem('lastName'));
  const [bio, setBio] = useState(sessionStorage.getItem('bio'));
  const [oldPassword,setOldPassword]=useState('');
  const [newPassword,setNewPassword]=useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [goodMessage, setgoodMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Access the history object

  const showGeneralSettings = () => {
    setActiveTab('general');
  };

  const showEditProfileSettings = () => {
    setActiveTab('editProfile');
  };

  const showChangePasswordSettings = () => {
    setActiveTab('changePassword');
  };
  const deleteAccount = () => {
  setIsLoading(true); // Set loading state to true before making the API call
  fetch('http://localhost:5206/api/Users/DeleteAccount', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
    } 
  }).then(response => {
    if (response.ok) {
      console.log('OK,Updated');
      setIsLoading(false);
      setgoodMessage('Deleted');
      clearErrorMessageAfterDelay();
      setTimeout(() => {
        handleLogOut();
        navigate(`/`); // Redirect the user after displaying the error message
      }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
    }else if (response.status === 10) { 
      // Handle bad request
      setIsLoading(false);
      setErrorMessage('Invalid Token'); 
      clearErrorMessageAfterDelay();
      setTimeout(() => {
        navigate(`/`); // Redirect the user after displaying the error message
      }, 2000); // Redirect after 3 seconds (adjust the delay as needed)
    }else {
      setIsLoading(false);
      setErrorMessage('Connection Problem. Please try again.Backend');
      clearErrorMessageAfterDelay(); // Set error message for the user
      }
  }).catch(error => {
    setIsLoading(false);
    setErrorMessage('Connection Problem. Fetch Error.');
    clearErrorMessageAfterDelay(); // Set error message for the user
  });
  };
  
  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage('');
      setgoodMessage('');
    }, 2000); // Clear error message after 3 seconds (3000 milliseconds)
  };
  // For Edit Profile Setting
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  }
  const handleLastNameChange = (e) => {
    setLastName(e.target.value); 
  }
  const handleBioChange = (e) => {
    setBio(e.target.value); 
  }
  const handleLogOut = (e) =>{
     sessionStorage.clear();
     console.log("Session Storage cleared");
     navigate(`/`);
  }
  const handleSubmitProfile = (e) => {
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
        setIsLoading(false);
        console.log('OK,Updated');
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('lastName', lastName);
        sessionStorage.setItem('bio', bio);
        setgoodMessage('Successfully Updated');  
        clearErrorMessageAfterDelay();  
    
      }else if (response.status === 15) { 
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Token Expired'); 
        clearErrorMessageAfterDelay(); 
        handleLogOut();
        
      }else if (response.status === 10) {
        // Handle bad request
        setIsLoading(false);
        setErrorMessage('Internal Server Error,Try again');
        clearErrorMessageAfterDelay(); // Set error message for the user
        
      }else if( response.status === 401){
        setIsLoading(false);
        setErrorMessage('Invalid token');
        clearErrorMessageAfterDelay(); // Set error message for the user
        handleLogOut();
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
// For Password Change
const handleNewPasswordChange = (e) => {
  setNewPassword(e.target.value);
}
const handleOldPasswordChange = (e) => {
  setOldPassword(e.target.value);
}
const handleSubmitPassword = (e) => {
  e.preventDefault();
  
  if (newPassword.length < 5) {
    setErrorMessage('Password must be at least 5 characters long.');
    clearErrorMessageAfterDelay();
    return; // Stop form submission if password is invalid
  }
  setIsLoading(true); // Set loading state to true before making the API call
  fetch('http://localhost:5206/api/Users/ChangePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
    }, 
    body: JSON.stringify({
      OldPassword: oldPassword, // Use the email from the authData context
      NewPassword: newPassword
    })
  }) 
  .then(response => {
    if (response.ok) {
      console.log('OK,Updated');
      setIsLoading(false);
      setgoodMessage('Successfully updated Password');
      setNewPassword('');
      setOldPassword('');
      clearErrorMessageAfterDelay();
      
    }else if (response.status === 10) { 
      // Handle bad request
      setIsLoading(false);
      setErrorMessage('Invalid Token'); 
      clearErrorMessageAfterDelay();
      handleLogOut();
    }else if (response.status === 20) {
      // Handle bad request
      setIsLoading(false);
      setErrorMessage('Wrong Password');
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
      <h2>Settings</h2>
      <div className="tabs">
        <button onClick={showGeneralSettings}>General</button>
        <button onClick={showEditProfileSettings}>Edit Profile</button>
        <button onClick={showChangePasswordSettings}>Change Password</button>
        <button onClick={deleteAccount}>Delete Account</button>     
      </div>
      <div className="content">
        {activeTab === 'general' && (
          <div>
            <h3>General Settings</h3>
            <p>
              Here is Where settings can be adjusted to users prefernce and style 
            </p>
          </div>
        )}
        {activeTab === 'editProfile' && (
          <div className="container">
          <h3>Edit Profile Information</h3>
          <form onSubmit={handleSubmitProfile}>
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
          
          
        </div>
        )}
        {activeTab === 'changePassword' && (
          <div className="container">
          <h2>Change Password</h2>
          <form onSubmit={handleSubmitPassword}>
            <label>Old Password</label>
            <input 
                type="current-password" 
                required 
                value={oldPassword} 
                onChange={handleOldPasswordChange} 
                disabled={isLoading} // Disable input field while loading
              />
              <br /><br />
            <label>New Password</label>
            <input 
                type="current-password" 
                required 
                value={newPassword} 
                onChange={handleNewPasswordChange} 
                disabled={isLoading} // Disable input field while loading
            /> 
            <button disabled={isLoading} >Submit</button>
          </form>
                  </div>
        )}
      </div>
      <p>
      {isLoading && <p>Loading...</p>}
          {goodMessage && <p style={{color: 'green'}}>{goodMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button onClick={handleLogOut}>Logout</button>
      </p>
    </div>
  );
}

export default Settings;
 