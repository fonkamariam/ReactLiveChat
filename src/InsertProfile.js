// ForgotPasswordPage.js
import React,{ useState } from 'react';
//import { Link, useNavigate } from 'react-router-dom';

function InsertProfile() {

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleButtonClick = () => {
    setIsOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
  };

  

  return (
    <div className="App">
      <div className={`content ${isOverlayVisible ? 'faded' : ''}`}>
        <h1>Main Content</h1>
        <button onClick={handleButtonClick}>Show Overlay</button>
      </div>

      {isOverlayVisible && (
        
        <div className="overlay">

          <div className="overlay-content">
            
          <form className='formSignUp' >
              <span className='logo'>Fonkagram</span>
              <span className='title'>Danger Zone</span>
                  Are you sure you want to delete this account?
                <button className='buttonTabDelete'    >Delete</button>
                
              
                  
              </form>
            <button onClick={handleCloseOverlay}>Close</button> 
          </div>
        </div>
       
      )}
    </div>  
  );
}
export default InsertProfile;