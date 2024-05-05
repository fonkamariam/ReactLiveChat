  // ForgotPasswordPage.js
  import React,{useEffect, useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';

  function EditProfile() {
    
    
    useEffect(() => {
      const fetchData = async () => {
        // Check if data exists in session storage
        const storedData = sessionStorage.getItem('firstName');
  
        if (storedData) {
          console.log("Data already exisits in sessionStorage");
        } else {
          console.log("getting userProfile Info");
    fetch('http://localhost:5206/api/UserProfile/GetOwnUserProfile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
      }
    }) 
    .then(response => {
      if (response.ok) {
        console.log('Got the UserProfile Information');
        return response.json();
      }else if (response.status === 15) { 
        console.log("Invalid Token StatusCode:15");
      }else if( response.status === 401){
        console.log("401");
      }else{
        console.log("Connection Problem , Please Try again"); 
      } 
    }).then(data => {
      console.log("checking Data");
      
      console.log("there is data for Profile Info"); 
      console.log(data.name); 
      
      sessionStorage.setItem('firstName', data.name);
      
      sessionStorage.setItem('lastName', data.bio);
      console.log(data.lastName);
      sessionStorage.setItem('bio',data.lastName);
      console.log(data.bio);
      console.log("no data"); 
     
    }).catch(error => {
      console.log("Fetch Error");
    });
        }
      };
  
      fetchData();
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts
  

    const [firstName, setFirstName] = useState(sessionStorage.getItem('firstName'));
    const [lastName, setLastName] = useState(sessionStorage.getItem('lastName'));
    const [bio, setBio] = useState(sessionStorage.getItem('bio'));
    
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
        <h2>Edit Profile Information</h2>
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
  export default EditProfile;
  