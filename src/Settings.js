import React, { useState } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { Link, useNavigate } from 'react-router-dom';

function Settings() {
  const [activeTab, setActiveTab] = useState('editProfile');
  // 
  const [firstName, setFirstName] = useState(sessionStorage.getItem('Name'));
  const [lastName, setLastName] = useState(sessionStorage.getItem('LastName'));
  const [bio, setBio] = useState(sessionStorage.getItem('Bio'));
  const [oldPassword,setOldPassword]=useState('');
  const [newPassword,setNewPassword]=useState('');
  // I don't need messages
  const [errorMessage, setErrorMessage] = useState('');
  const [goodMessage, setgoodMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Access the history object


  const showEditProfileSettings = () => {
    setActiveTab('editProfile');
  };

  const showChangePasswordSettings = () => {
    setActiveTab('changePassword');
  };
  const showDeleteSettings =()=>{
    setActiveTab('Delete');
  };
  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
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
    }else{
      return;
    }
    
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
/** here for DropDown */
const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleButtonClick = () => {
    setIsOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
  };


  return (
    <div className="Conversation">
      <h2 className='Setting'>Settings</h2>
      <div className="tabs"> 
        <button className='buttonTab' onClick={showEditProfileSettings}>Edit Profile</button>
        <button className='buttonTab' onClick={showChangePasswordSettings}>Change Password</button>
        <button className='buttonTab' onClick={showDeleteSettings}>Delete Account</button>     
        {/*Delete Account(DropDown,Shade) code Start */}
        <div className="App">
      <div className={`content ${isOverlayVisible ? 'faded' : ''}`}>
        <button onClick={handleButtonClick}>Edit Profile</button>
      </div>

      {isOverlayVisible && (
        <div className="overlay">
          <div className="overlay-content">

          <form className='formSignUp' onSubmit={handleSubmitPassword}>
          <span className='logo'>Fonkagram</span>
          <span className='title'>Danger Zone</span>
              Are you sure you want to delete this account?
            <button className='buttonTabDelete' onClick={deleteAccount}  disabled={isLoading} >Delete</button>
            
          {isLoading && <p className='isLoading'>Loading...</p>}
          <p className='login'><Link to="/chats">Go Back to Chats</Link></p>
          
          <span ><button className='logoutChat' onClick={handleLogOut}>Logout</button>
           </span>
              
          </form>
          
        
            <button onClick={handleCloseOverlay}>Close</button>
          </div>
        </div>
      )}
    </div>  
    {/*Delete Account (Drop Down,Shade) code End */}
        

      </div>
      <div className="contentSignUp">
        {activeTab === 'editProfile' && (
          <div className="formContainer">
          <form className='formSignUp' onSubmit={handleSubmitPassword}>
          <span className='logo'>Fonkagram</span>
          <span className='title'>Danger Zone</span>
              Are you sure you want to delete this account?
            <button className='buttonTabDelete' onClick={deleteAccount}  disabled={isLoading} >Delete</button>
            
          {isLoading && <p className='isLoading'>Loading...</p>}
          <p className='login'><Link to="/chats">Go Back to Chats</Link></p>
          
          <span ><button className='logoutChat' onClick={handleLogOut}>Logout</button>
           </span>
              
          </form>
          
          
        </div>
        )}
        {activeTab === 'changePassword' && (
          <div className="formContainer">
          <form className='formSignUp' onSubmit={handleSubmitPassword}>
          <span className='logo'>Fonkagram</span>
          <span className='title'>Change Password</span>
              <input 
                className='emailInput'
                placeholder='Old Password'
                type="current-password" 
                required 
                value={oldPassword} 
                onChange={handleOldPasswordChange} 
                disabled={isLoading} // Disable input field while loading
              />
              
            <input 
            className='emailInput'
            placeholder='New Password'
                type="current-password" 
                required 
                value={newPassword} 
                onChange={handleNewPasswordChange} 
                disabled={isLoading} // Disable input field while loading
            /> 
            <button className='buttonSignUp' disabled={isLoading} >Submit</button>
            
            {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
          {goodMessage && <p className='goodMessage'>{goodMessage}</p>}
          {isLoading && <p className='isLoading'>Loading...</p>}
          <p className='login'><Link to="/chats">Go Back to Chats</Link></p>
            
          <span ><button className='logoutChat' onClick={handleLogOut}>Logout</button>
           </span>
              
          </form>
        </div>
        )}
         {activeTab === 'Delete' && (
          <div className="formContainer">
          <form className='formSignUp' onSubmit={handleSubmitPassword}>
          <span className='logo'>Fonkagram</span>
          <span className='title'>Danger Zone</span>
              Are you sure you want to delete this account?
            <button className='buttonTabDelete' onClick={deleteAccount}  disabled={isLoading} >Delete</button>
            
          {isLoading && <p className='isLoading'>Loading...</p>}
          <p className='login'><Link to="/chats">Go Back to Chats</Link></p>
          
          <span ><button className='logoutChat' onClick={handleLogOut}>Logout</button>
           </span>
              
          </form>
        </div>
        )}
        
      </div>
      
    </div>
  );
}

export default Settings;
